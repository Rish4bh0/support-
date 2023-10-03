const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please enter customers name'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Please enter customers email'],
    },
    customerContact: {
      type: Number,
      required: [true, 'Please enter customers contact'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: String,
      required: [true, 'Please select a product'],
      enum: [
        'Ecommerce',
        'Employee management system',
        'HR management system',
        'CMS',
      ],
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority type'],
      enum: ['High', 'Low'],
    },
    issueType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'issueType',
    },
    description: {
      type: String,
      required: [true, 'Please enter a description of the issue'],
    },
    status: {
      type: String,
      required: true,
      enum: ['new', 'open','review', 'close'],
      default: 'new',
    },
    closedAt: {
      type: Date,
    },
    media: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
