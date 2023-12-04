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
  focalPersonName:{
    type: String
  },
  focalPersonContact:{
    type: Number
  },
  focalPersonEmail:{
    type: String
  },
});

module.exports = mongoose.model('Organization', organizationSchema);
