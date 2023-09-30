const mongoose = require('mongoose');

const issueTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false }, // set unique to false
  // other fields...
});


module.exports = mongoose.model('issueType', issueTypeSchema);
