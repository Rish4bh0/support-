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
  savetime,
  report,
  
 
} = require('../controllers/ticketController')

const { protect } = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware');

// Re-route into note router
const noteRouter = require('./noteRoutes')
router.use('/:ticketId/notes', noteRouter)


router
  .route('/')
 // .get(protect,roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']), getTickets)
  .post( protect, createTicket)
  .get(protect, getTickets)

  router.route('/my').get(protect, getTicketss);

router.route('/all').get(getAllTickets);
router.route('/report').get(report);



router
  .route('/:id')
  .get(protect, getTicket)
  .delete(protect,roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE', 'ORGAGENT']), deleteTicket)
  .put( protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE', 'ORGAGENT']), updateTicket)

  

module.exports = router


//protect, roleMiddleware(['ADMIN', 'SUPERVISOR', 'EMPLOYEE']),