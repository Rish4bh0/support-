const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const notification = require("../models/notification");

const createProject = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const {  projectName } = req.body;

  if (! projectName) {
    res.status(400).json({ error: "Please provide a name for the project" });
    return;
  }

  const existingProject = await Project.findOne({  projectName });

  if (existingProject) {
    res.status(400).json({ error: "Project already exists" });
    return;
  }

  const project = await Project.create({  projectName });

  res.status(201).json(project);
});

const getAllProject = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const project = await Project.find();
  res.status(200).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const {  projectName} = req.body;

  if (!name) {
    res.status(400).json({ error: "Please provide a name for the project" });
    return;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {  projectName },
    { new: true } // Return the updated document
  );

  if (!updatedProject) {
    return sendErrorResponse(res, 404, "Project not found");
  }

  res.status(200).json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ error: "Issue type not found" });
    return;
  }

  await project.remove();

  res.status(200).json({ success: true });
});

// Controller to select an issue type by ID
const selectProject = async (req, res) => {
  try {
    // Get user using the id and JWT
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    const { id } = req.params;
    const selectedProject = await Project.findById(id);

    if (!selectedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(selectedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProject,
  getAllProject,
  updateProject,
  deleteProject,
  selectProject,
};
