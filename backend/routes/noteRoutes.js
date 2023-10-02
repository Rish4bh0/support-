const express = require('express')
const router = express.Router({ mergeParams: true })
const { getNotes, addNote } = require('../controllers/noteController')

const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(getNotes)
  .post(protect, addNote)

module.exports = router

// /api/tickets/:ticketId/notes
