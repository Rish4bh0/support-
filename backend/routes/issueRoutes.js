const express = require('express');
const router = express.Router();
const {
  createIssueType,
  getAllIssueTypes,
  updateIssueType,
  deleteIssueType,
  selectIssueType,
} = require('../controllers/issueController'); // Import your issueType controller functions

const { protect } = require('../middleware/authMiddleware');

// Protected routes for issue types
router
  .route('/')
  .post(createIssueType)
  .get(getAllIssueTypes);

router
  .route('/:id')
  .put(updateIssueType)
  .get(selectIssueType)
  .delete(deleteIssueType);

module.exports = router;
