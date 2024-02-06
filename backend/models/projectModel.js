const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, unique: false },
});

module.exports = mongoose.model("project", projectSchema);
