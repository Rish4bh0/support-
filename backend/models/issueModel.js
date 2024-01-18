const mongoose = require("mongoose");

const issueTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
});

module.exports = mongoose.model("issueType", issueTypeSchema);
