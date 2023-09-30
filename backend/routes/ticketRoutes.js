const express = require('express')
const router = express.Router()

const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTickets,
  getTicketss,
  
 
} = require('../controllers/ticketController')


const { protect } = require('../middleware/authMiddleware')


// Re-route into note router
const noteRouter = require('./noteRoutes')
router.use('/:ticketId/notes', noteRouter)

router
  .route('/')
  .get(protect, getTickets)
  .post( protect, createTicket)

  router.route('/my').get(protect, getTicketss);

router.route('/all').get(getAllTickets);

router
  .route('/:id')
  .get(protect, getTicket)
  .delete(protect, deleteTicket)
  .put( updateTicket)

  

module.exports = router
