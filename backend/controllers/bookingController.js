const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const { isWeekendOrHoliday } = require('../helpers/dateHelpers');
const { isValidTimeSlot } = require('../helpers/validationHelpers');

// Definizione dei time slot validi come costante
const VALID_TIME_SLOTS = [
  '8.30-10.00',
  '10.00-12.30',
  '14.00-15.30',
  '15.30-17.00',
  '17.00-18.30',
  '18.30-20.00',
  '20.00-21.30',
];

const createBooking = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    
    const bookingDate = new Date(date);
    
    // Verifica se la data è un weekend o un giorno festivo
    if (isWeekendOrHoliday(bookingDate)) {
      return res.status(400).json({ 
        message: 'Non è possibile prenotare nei weekend o nei giorni festivi' 
      });
    }
    
    // Verifica se il time slot è valido
    if (!isValidTimeSlot(timeSlot, VALID_TIME_SLOTS)) {
      return res.status(400).json({ message: 'Time slot non valido' });
    }
    
    // Verifica se l'utente ha già una prenotazione per quella data
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      date: bookingDate,
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Hai già una prenotazione per questa data' 
      });
    }
    
    // Verifica se ci sono ancora posti disponibili per quel time slot
    const bookingsCount = await Booking.countDocuments({
      date: bookingDate,
      timeSlot,
    });
    
    if (bookingsCount >= 15) {
      return res.status(400).json({ 
        message: 'Non ci sono più posti disponibili per questo time slot' 
      });
    }
    
    // Crea la prenotazione
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
    
    const bookingCounts = {};
    for (const slot of VALID_TIME_SLOTS) {
      bookingCounts[slot] = await Booking.countDocuments({ date, timeSlot: slot });
    }
    
    const availability = VALID_TIME_SLOTS.map((slot) => {
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