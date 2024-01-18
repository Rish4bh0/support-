const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProject,
  updateProject,
  deleteProject,
  selectProject,
} = require('../controllers/projectController'); 

const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
// Protected routes for issue types
router.route('/').get(protect, getAllProject);

router.route('/').post(protect,roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']), createProject)
  

router
  .route('/:id')
  .put( updateProject)
  .get(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),selectProject)
  .delete(protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),deleteProject);

module.exports = router;