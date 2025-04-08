const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const { isMembershipExpired } = require('../helpers/dateHelpers');

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

const checkExpiredMemberships = async (req, res, next) => {
  try {
    const premiumUsers = await User.find({
      membershipType: { $in: ['premium1', 'premium3', 'premium6', 'premium12'] }
    });
    
    for (const user of premiumUsers) {
      if (isMembershipExpired(user.membershipStartDate, user.membershipType)) {
        user.membershipType = 'basic';
        await user.save();
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { 
  cleanupPastBookings,
  checkExpiredMemberships
};