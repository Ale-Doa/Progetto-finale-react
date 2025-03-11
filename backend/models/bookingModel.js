const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        '8.30-10.00',
        '10.00-12.30',
        '14.00-15.30',
        '15.30-17.00',
        '17.00-18.30',
        '18.30-20.00',
        '20.00-21.30',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only book one time slot per day
bookingSchema.index({ user: 1, date: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;