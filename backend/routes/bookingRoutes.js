const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
  getAllBookings,
  cleanupPastBookings
} = require('../controllers/bookingController');
const { protect, premium, admin } = require('../middleware/authMiddleware');
const { cleanupPastBookings: cleanupMiddleware } = require('../middleware/cleanupMiddleware');

// Applica il middleware di cleanup a tutte le route
router.use(cleanupMiddleware);

router.route('/')
  .post(protect, premium, createBooking)
  .get(protect, getUserBookings);

router.route('/all').get(protect, admin, getAllBookings);
router.route('/:id').delete(protect, deleteBooking);
router.route('/date/:date').get(protect, getBookingsByDate);
router.route('/cleanup').delete(protect, admin, cleanupPastBookings);

module.exports = router;