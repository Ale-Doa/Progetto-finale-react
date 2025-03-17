const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserMembership,
  deleteUserAccount,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .delete(protect, deleteUserAccount); 

router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUserMembership);

module.exports = router;