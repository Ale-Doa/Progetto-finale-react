const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Booking = require('./Bookings');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  membershipType: {
    type: String,
    enum: ['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'],
    default: 'basic',
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.post('save', async function (doc, next) {
  try {
    if (this.$original && this.$original.membershipType !== doc.membershipType) {
      const previousMembershipType = this.$original.membershipType;
      const currentMembershipType = doc.membershipType;

      if (
        ['premium1', 'premium3', 'premium6', 'premium12'].includes(previousMembershipType) &&
        currentMembershipType === 'basic'
      ) {
        await Booking.deleteMany({ user: doc._id });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);