const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, premium, admin } = require('../middleware/authMiddleware');
const { cleanupPastBookings } = require('../middleware/cleanupMiddleware');

router.route('/')
  .post(protect, premium, createBooking)
  .get(cleanupPastBookings, protect, getUserBookings);

router.route('/all').get(cleanupPastBookings, protect, admin, getAllBookings);
router.route('/:id').delete(protect, deleteBooking);
router.route('/date/:date').get(cleanupPastBookings, protect, getBookingsByDate);

module.exports = router;