const Booking = require('../models/bookingModel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Premium
const createBooking = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    
    // Convert date string to Date object
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    // Check if booking is for today or in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate <= today) {
      return res.status(400).json({ message: 'Cannot book for today or past dates' });
    }
    
    // Check if user already has a booking for this date
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      date: bookingDate,
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this date' });
    }
    
    // Check if the time slot is available
    const slotBooked = await Booking.findOne({
      date: bookingDate,
      timeSlot,
    });
    
    if (slotBooked) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const booking = await Booking.create({
      user: req.user._id,
      date: bookingDate,
      timeSlot,
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if booking is for tomorrow or later
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (bookingDate < tomorrow) {
      return res.status(400).json({ message: 'Cannot cancel bookings for today or past dates' });
    }
    
    await booking.remove();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a specific date
// @route   GET /api/bookings/date/:date
// @access  Private
const getBookingsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.find({ date }).populate('user', 'name email');
    
    // Create an array of all time slots
    const allTimeSlots = [
      '8.30-10.00',
      '10.00-12.30',
      '14.00-15.30',
      '15.30-17.00',
      '17.00-18.30',
      '18.30-20.00',
      '20.00-21.30',
    ];
    
    // Create a map of booked time slots
    const bookedSlots = bookings.reduce((acc, booking) => {
      acc[booking.timeSlot] = {
        bookingId: booking._id,
        userName: booking.user.name,
        userEmail: booking.user.email,
      };
      return acc;
    }, {});
    // Create availability array
    const availability = allTimeSlots.map((slot) => ({
      timeSlot: slot,
      isBooked: Boolean(bookedSlots[slot]),
      booking: bookedSlots[slot] || null,
    }));
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
};