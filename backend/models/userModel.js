const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add a email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password']
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPERVISOR', 'EMPLOYEE'], 
      default: 'USER', // Set a default role if needed
    },
    resetPasswordToken: String, // Add these fields to the schema
    resetPasswordExpire: Date,
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
