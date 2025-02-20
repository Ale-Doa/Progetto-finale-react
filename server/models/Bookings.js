const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  slot: {
    type: String,
    required: true,
    enum: [
      '9:00-10:30',
      '10:30-12:00',
      '14:00-15:30',
      '15:30-17:00',
      '17:00-18:30',
      '18:30-20:00',
      '20:00-21:30',
    ],
  },
});

module.exports = mongoose.model('Bookings', bookingSchema);