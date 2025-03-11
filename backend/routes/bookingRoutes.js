const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
} = require('../controllers/bookingController');
const { protect, premium } = require('../middleware/authMiddleware');

// All booking routes are protected
router.route('/')
  .post(protect, premium, createBooking)
  .get(protect, getUserBookings);

router.route('/:id').delete(protect, deleteBooking);
router.route('/date/:date').get(protect, getBookingsByDate);

module.exports = router;