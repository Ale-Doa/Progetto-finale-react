const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isMembershipExpired } = require('../helpers/dateHelpers');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.membershipType === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

const premium = (req, res, next) => {
  if (
    req.user &&
    ['premium1', 'premium3', 'premium6', 'premium12'].includes(req.user.membershipType)
  ) {
    // Verifica se l'abbonamento è scaduto
    if (isMembershipExpired(req.user.membershipStartDate, req.user.membershipType)) {
      // Aggiorna l'utente a basic se l'abbonamento è scaduto
      req.user.membershipType = 'basic';
      req.user.save();
      
      res.status(401);
      throw new Error('Il tuo abbonamento è scaduto. Rinnova per accedere a questa funzionalità.');
    }
    
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized. Premium membership required');
  }
};

module.exports = { protect, admin, premium };