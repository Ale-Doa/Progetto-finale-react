const Booking = require('../models/Bookings');
const User = require('../models/User');
const { DateTime } = require('luxon');
const { isHoliday } = require('../utils/utils');

const getBookings = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const dt = DateTime.fromISO(dateParam);

    if (dt.weekday === 6 || dt.weekday === 7 || isHoliday(dt.toJSDate())) {
      return res.json({ slots: [], error: 'La palestra è chiusa in questa data' });
    }

    const slots = [
      '9:00-10:30',
      '10:30-12:00',
      '14:00-15:30',
      '15:30-17:00',
      '17:00-18:30',
      '18:30-20:00',
      '20:00-21:30',
    ];

    const slotsData = await Promise.all(
      slots.map(async (slot) => {
        const count = await Booking.countDocuments({ bookingDate: dt.toJSDate(), slot });
        return {
          name: slot,
          available: 15 - count,
          isFull: count >= 15,
        };
      })
    );

    const userBookings = await Booking.find({ user: req.session.user.id }).lean();
    res.json({ slots: slotsData, userBookings });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il caricamento degli slot' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const dt = DateTime.fromISO(date);

    if (dt.weekday === 6 || dt.weekday === 7 || isHoliday(dt.toJSDate())) {
      return res.status(400).json({ error: 'La palestra è chiusa in questa data' });
    }

    const bookingCount = await Booking.countDocuments({ bookingDate: dt.toJSDate(), slot });
    if (bookingCount >= 15) {
      return res.status(400).json({ error: 'Slot completo' });
    }

    const existingBooking = await Booking.findOne({
      user: req.session.user.id,
      bookingDate: dt.toJSDate(),
    });
    if (existingBooking) {
      return res.status(400).json({ error: 'Hai già una prenotazione per questa data' });
    }

    await Booking.create({
      user: req.session.user.id,
      bookingDate: dt.toJSDate(),
      slot,
    });

    res.json({ message: 'Prenotazione effettuata con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la prenotazione' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.body;
    const booking = await Booking.findById(id);

    if (!booking || booking.user.toString() !== req.session.user.id) {
      return res.status(403).json({ error: 'Non puoi cancellare questa prenotazione' });
    }

    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Prenotazione cancellata con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la cancellazione della prenotazione' });
  }
};

module.exports = { getBookings, createBooking, cancelBooking };