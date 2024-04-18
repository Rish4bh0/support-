const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
  forgotPassword,
  resetPassword,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser)

router.post('/login', loginUser)

router.get('/get', getAllUsers)

router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword);

router.post('/create', createUser)
router.get('/create/:id', getUserById)
router.put('/create/:id', updateUser)
router.delete('/create/:id', deleteUser)

// Protected route (2nd argument) - protect
router.get('/me', protect, getMe)

module.exports = router
