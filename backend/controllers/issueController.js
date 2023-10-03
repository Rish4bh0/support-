const asyncHandler = require('express-async-handler');
const IssueType = require('../models/issueModel');
const User = require("../models/userModel");
const createIssueType = asyncHandler(async (req, res) => {
   // Get user using the id and JWT
   const user = await User.findById(req.user.id);

   if (!user) {
     res.status(401);
     throw new Error("User not found");
   }
  
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Please provide a name for the issue type' });
    return;
  }

  const existingIssueType = await IssueType.findOne({ name });

  if (existingIssueType) {
    res.status(400).json({ error: 'Issue type already exists' });
    return;
  }

  const issueType = await IssueType.create({ name });
  res.status(201).json(issueType);
});

const getAllIssueTypes = asyncHandler(async (req, res) => {
     // Get user using the id and JWT
     const user = await User.findById(req.user.id);

     if (!user) {
       res.status(401);
       throw new Error("User not found");
     }
  
  const issueTypes = await IssueType.find();
  res.status(200).json(issueTypes);
});

const updateIssueType = asyncHandler(async (req, res) => {
     // Get user using the id and JWT
     const user = await User.findById(req.user.id);

     if (!user) {
       res.status(401);
       throw new Error("User not found");
     }
  
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Please provide a name for the issue type' });
    return;
  }

  const issueType = await IssueType.findById(req.params.id);

  if (!issueType) {
    res.status(404).json({ error: 'Issue type not found' });
    return;
  }

  issueType.name = name;
  await issueType.save();

  res.status(200).json(issueType);
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
    res.status(404).json({ error: 'Issue type not found' });
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
        return res.status(404).json({ error: 'Issue type not found' });
      }
  
      res.status(200).json(selectedIssueType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  

module.exports = {
  createIssueType,
  getAllIssueTypes,
  updateIssueType,
  deleteIssueType,
  selectIssueType
};
