const express = require('express');
const router = express.Router();
const { getBookings, createBooking, cancelBooking } = require('../controllers/bookingsController');

router.get('/', getBookings);
router.post('/prenota', createBooking);
router.post('/cancella', cancelBooking);

module.exports = router;