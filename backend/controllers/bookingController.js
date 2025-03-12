const Booking = require('../models/bookingModel');

// Funzione per verificare se una data è un weekend o una festività italiana
const isWeekendOrHoliday = (date) => {
  const day = date.getDay();
  // 0 è domenica, 6 è sabato
  if (day === 0 || day === 6) {
    return true;
  }
  
  // Festività italiane (formato MM-DD)
  const italianHolidays = [
    '01-01', // Capodanno
    '01-06', // Epifania
    '04-25', // Festa della Liberazione
    '05-01', // Festa del Lavoro
    '06-02', // Festa della Repubblica
    '08-15', // Ferragosto
    '11-01', // Tutti i Santi
    '12-08', // Immacolata Concezione
    '12-25', // Natale
    '12-26', // Santo Stefano
  ];
  
  // Formato MM-DD per la data corrente
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayOfMonth = date.getDate().toString().padStart(2, '0');
  const dateString = `${month}-${dayOfMonth}`;
  
  return italianHolidays.includes(dateString);
};

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
    
    // Check if the time slot has reached the maximum number of bookings (15)
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
    
    // Check if booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.membershipType !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this booking' });
    }
    
    // Use deleteOne instead of remove (which is deprecated)
    await Booking.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Booking removed' });
  } catch (error) {
    console.error('Error deleting booking:', error);
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
    
    // Count bookings for each time slot
    const bookingCounts = {};
    for (const slot of allTimeSlots) {
      bookingCounts[slot] = await Booking.countDocuments({ date, timeSlot: slot });
    }
    
    // Create availability array with booking counts
    const availability = allTimeSlots.map((slot) => {
      const slotBookings = bookings.filter(b => b.timeSlot === slot);
      const isFullyBooked = bookingCounts[slot] >= 15;
      
      return {
        timeSlot: slot,
        isBooked: isFullyBooked, // Now "isBooked" means the slot is fully booked
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

module.exports = {
  createBooking,
  getUserBookings,
  deleteBooking,
  getBookingsByDate,
};