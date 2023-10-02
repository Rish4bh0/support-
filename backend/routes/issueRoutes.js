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
const roleMiddleware = require('../middleware/roleMiddleware');
// Protected routes for issue types
router
  .route('/')
  .post(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),createIssueType)
  .get(protect, getAllIssueTypes);

router
  .route('/:id')
  .put(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),updateIssueType)
  .get(protect, selectIssueType)
  .delete(protect,roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),deleteIssueType);

module.exports = router;
