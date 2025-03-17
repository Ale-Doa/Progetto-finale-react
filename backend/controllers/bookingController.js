const Booking = require('../models/bookingModel');

const isWeekendOrHoliday = (date) => {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return true;
  }
  
  const italianHolidays = [
    '01-01', 
    '01-06', 
    '04-25', 
    '05-01', 
    '06-02', 
    '08-15', 
    '11-01', 
    '12-08', 
    '12-25', 
    '12-26', 
  ];
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayOfMonth = date.getDate().toString().padStart(2, '0');
  const dateString = `${month}-${dayOfMonth}`;
  
  return italianHolidays.includes(dateString);
};

const createBooking = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate <= today) {
      return res.status(400).json({ message: 'Cannot book for today or past dates' });
    }
    
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      date: bookingDate,
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this date' });
    }
    
    const bookingsCount = await Booking.countDocuments({
      date: bookingDate,
      timeSlot,
    });
    
    if (bookingsCount >= 15) {
      return res.status(400).json({ message: 'This time slot is fully booked' });
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

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user._id.toString() && req.user.membershipType !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this booking' });
    }
    
    await Booking.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Booking removed' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.find({ date }).populate('user', 'name email');
    
    const allTimeSlots = [
      '8.30-10.00',
      '10.00-12.30',
      '14.00-15.30',
      '15.30-17.00',
      '17.00-18.30',
      '18.30-20.00',
      '20.00-21.30',
    ];
    
    const bookingCounts = {};
    for (const slot of allTimeSlots) {
      bookingCounts[slot] = await Booking.countDocuments({ date, timeSlot: slot });
    }
    
    const availability = allTimeSlots.map((slot) => {
      const slotBookings = bookings.filter(b => b.timeSlot === slot);
      const isFullyBooked = bookingCounts[slot] >= 15;
      
      return {
        timeSlot: slot,
        isBooked: isFullyBooked, 
        bookingsCount: bookingCounts[slot],
        booking: slotBookings.length > 0 ? {
          bookingId: slotBookings[0]._id,
          userName: slotBookings[0].user.name,
          userEmail: slotBookings[0].user.email,
        } : null,
      };
    });
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cleanupPastBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await Booking.deleteMany({
      date: { $lt: today }
    });
    
    res.json({ 
      message: `Pulizia completata: ${result.deletedCount} prenotazioni passate rimosse` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
  getAllBookings,
  cleanupPastBookings
};