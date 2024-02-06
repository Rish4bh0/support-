const asyncHandler = require('express-async-handler') // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const jwt = require('jsonwebtoken') // JSON Web Token for authentication and authorization
const bcrypt = require('bcryptjs') // A library to help you hash passwords.
const crypto = require('crypto');
const User = require('../models/userModel')
const transporter = require ('../middleware/nodeMailer')
const notification = require('../models/notification')
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
      organization: user.organization,
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
      organization: user.organization,
      token: generateToken(user._id)
    })
/*
    // add notification for login
  await notification.create({
    user: user._id,
    title: 'login',
    type: 1,
    text: `New login at ${new Date()}`,
    read: false,
  })
*/
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
    email: user.email,
    organization: user.organization
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
    organization: user.organization,
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

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, organization } = req.body; 

  // Validation
  if (!name || !email || !password ) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check for existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with optional organizationId
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    organization, // Include the 'organization' field
  });

  // User is created
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization, // Include organization ID in the response
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User could not be created');
  }
});

// Update a user by ID
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, organization } = req.body; // Include 'role' and 'organizationId'

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.role = role;
    user.organization = organization; // Include 'organization' field
    // Check if a new password is provided and hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization, // Include organization ID in the response
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

const deleteUser = asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndRemove(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

const getUserById = asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
  forgotPassword,
  resetPassword,
  createUser,
  updateUser,
  deleteUser,
  getUserById
}
