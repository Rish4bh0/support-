const asyncHandler = require("express-async-handler");
const IssueType = require("../models/issueModel");
const User = require("../models/userModel");
const notification = require("../models/notification");

const createIssueType = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Please provide a name for the issue type" });
    return;
  }

  const existingIssueType = await IssueType.findOne({ name });

  if (existingIssueType) {
    res.status(400).json({ error: "Issue type already exists" });
    return;
  }

  const issueType = await IssueType.create({ name });

  res.status(201).json(issueType);
});



const getAllIssueTypes = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Calculate skip value based on page and pageSize
  let skip = (page - 1) * pageSize;
  if (skip < 0) {
    skip = 0; // Ensure skip is non-negative
  }
  const count = await IssueType.countDocuments({});
  const issueTypes = await IssueType.find().skip(skip).limit(Number(pageSize));
  
  res.status(200).json({ issueTypes, count });
});





const updateIssueType = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Please provide a name for the issue type" });
    return;
  }

  const updatedIssueType = await IssueType.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true } // Return the updated document
  );

  if (!updatedIssueType) {
    return sendErrorResponse(res, 404, "Issue type not found");
  }

  res.status(200).json(updatedIssueType);
});

const deleteIssueType = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const issueType = await IssueType.findById(req.params.id);

  if (!issueType) {
    res.status(404).json({ error: "Issue type not found" });
    return;
  }

  await issueType.remove();

  res.status(200).json({ success: true });
});

// Controller to select an issue type by ID
const selectIssueType = async (req, res) => {
  try {
    // Get user using the id and JWT
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    const { id } = req.params;
    const selectedIssueType = await IssueType.findById(id);

    if (!selectedIssueType) {
      return res.status(404).json({ error: "Issue type not found" });
    }

    res.status(200).json(selectedIssueType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createIssueType,
  getAllIssueTypes,
  updateIssueType,
  deleteIssueType,
  selectIssueType,
};
