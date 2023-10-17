const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an organization name'],
  },
  contact: {
    type: Number
  },
  email: {
    type: String
  },
  payment: {
    type: String,
    //required: [true, 'Please select a product'],
    enum: [
      'Paid',
      'Paid Amc',
      'Free support',
      'Free support period under AMC',
      'Support contract',
    ],
  },
  description: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Organization', organizationSchema);
