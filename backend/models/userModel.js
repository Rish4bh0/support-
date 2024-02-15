const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    designation: {
      type: String,
      //required: [true, 'Please add designation']
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
      default: mongoose.Types.ObjectId('65c1f65226c16a4a38b2b81d')

    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPERVISOR', 'EMPLOYEE','ORGAGENT'], 
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
