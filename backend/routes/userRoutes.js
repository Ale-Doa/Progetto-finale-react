const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserMembership,
  deleteUserAccount, // Aggiungi questa importazione
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .delete(protect, deleteUserAccount); // Aggiungi questa route

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUserMembership);

module.exports = router;