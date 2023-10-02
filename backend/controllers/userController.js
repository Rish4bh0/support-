const asyncHandler = require('express-async-handler') // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const jwt = require('jsonwebtoken') // JSON Web Token for authentication and authorization
const bcrypt = require('bcryptjs') // A library to help you hash passwords.
const crypto = require('crypto');
const User = require('../models/userModel')
const transporter = require ('../middleware/nodeMailer')

// @desc    Register a new user
// @route   /api/users
// @access  Public

/**
 * 'asyncHandler' is a simple middleware for handling exceptions
 * inside of async express routes and passing them to your express
 * error handlers.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body // destructure the request body params

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  // Check for existing user
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10) // 10 is the number of rounds
  const hashedPassword = await bcrypt.hash(password, salt) // hash the password

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  // User is created
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('User could not be created')
  }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body // destructuring

  const user = await User.findOne({ email })

  // Check User and Password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(401) // Unauthorized
    throw new Error('Invalid credentials')
  }
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find(); // Fetch all users
  const simplifiedUsers = users.map(user => ({
    _id: user._id,
    name: user.name,
    role: user.role,
  }));
  res.json(simplifiedUsers);
});


// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  }
  res.status(200).json(user)
})

// Generate token
generateToken = id => {
  
  return jwt.sign({ id }, "hsdohf", {
    expiresIn: '30d'
  })
}

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user with the given email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour

  await user.save();

  // Send an email with a password reset link
  const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
  const mailOptions = {
    from: 'helpdeskx1122@gmail.com',
    to: user.email,
    subject: 'Password Reset Request',
    html: `Please click this <a href="${resetLink}">link</a> to reset your password.`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.token;
  const { newPassword } = req.body;

  // Find the user by the reset token and check if it's still valid
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Hash the new password and save it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
  forgotPassword,
  resetPassword
}
