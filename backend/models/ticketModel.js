const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,

    },
    customerName: {
      type: String,

    },
    customerEmail: {
      type: String,

    },
    customerContact: {
      type: Number,

    },
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: 'User',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: String,
      //required: [true, 'Please select a product'],
      enum: [
        'Ecommerce',
        'Employee management system',
        'HR management system',
        'CMS',
      ],
    },
    priority: {
      type: String,
     // required: [true, 'Please select a priority type'],
      enum: ['High', 'Low'],
    },
    issueType: {
      type: mongoose.Schema.Types.ObjectId,
    //  required: true,
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
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',

    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
