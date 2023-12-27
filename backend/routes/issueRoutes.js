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
router.route('/').get(protect, getAllIssueTypes);

router.route('/').post(protect,roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']), createIssueType)
  

router
  .route('/:id')
  .put( updateIssueType)
  .get(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),selectIssueType)
  .delete(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),deleteIssueType);

module.exports = router;
// roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),