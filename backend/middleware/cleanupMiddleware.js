const Booking = require('../models/bookingModel');

const cleanupPastBookings = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Booking.deleteMany({
      date: { $lt: today }
    });
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { cleanupPastBookings };