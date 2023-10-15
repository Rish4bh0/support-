const express = require('express')
const router = express.Router({ mergeParams: true })
const { getNotes, addNote, calculateTotalTimeForTicket } = require('../controllers/noteController')

const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get( getNotes)
  .post(protect, addNote)

  router.route('/cal').get(calculateTotalTimeForTicket);

module.exports = router