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
      enum: ['High', 'Low', 'Unknown'],
      required: false,
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
     // required: true,
      enum: ['draft', 'new', 'open','review', 'close'],
      default: 'draft',
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

    mediaUrl: String,
    
    mediaType: String,
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
