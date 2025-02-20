const User = require('../models/User');
const Booking = require('../models/Bookings');

const getAdminDashboard = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.membershipType !== 'admin') {
      return res.status(403).json({ error: 'Accesso non autorizzato' });
    }

    const users = await User.find({ membershipType: { $ne: 'admin' }}).lean();
    const usersWithExpiry = users.map((user) => {
      let subscriptionEndDate = null;
      if (['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType)) {
        const months = parseInt(user.membershipType.replace('premium', ''), 10);
        const registrationDate = DateTime.fromJSDate(user.registrationDate);
        subscriptionEndDate = registrationDate.plus({ months }).toISODate();
      }
      return { ...user, subscriptionEndDate };
    });

    res.json({ users: usersWithExpiry });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il caricamento della dashboard admin' });
  }
};

const updateMembership = async (req, res) => {
  try {
    const { userId, membershipType } = req.body;

    if (!['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'].includes(membershipType)) {
      return res.status(400).json({ error: 'Tipo di abbonamento non valido' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    if (
      ['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType) &&
      membershipType === 'basic'
    ) {
      await Booking.deleteMany({ user: userId });
    }

    await User.findByIdAndUpdate(userId, { membershipType }, { new: true });
    res.json({ message: 'Abbonamento aggiornato con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'abbonamento' });
  }
};

module.exports = { getAdminDashboard, updateMembership };