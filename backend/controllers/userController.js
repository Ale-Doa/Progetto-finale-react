const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel'); 
const { calculateExpiryDate, isMembershipExpired } = require('../helpers/dateHelpers');
const { isValidEmail, isStrongPassword } = require('../helpers/validationHelpers');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato email non valido' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        message: 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero' 
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato email non valido' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType)) {
        if (isMembershipExpired(user.membershipStartDate, user.membershipType)) {
          user.membershipType = 'basic';
          await user.save();
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const expiryDate = calculateExpiryDate(user.membershipStartDate, user.membershipType);
      const isExpired = isMembershipExpired(user.membershipStartDate, user.membershipType);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        membershipStartDate: user.membershipStartDate,
        membershipExpiryDate: expiryDate,
        isExpired: isExpired
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    const usersWithExpiryInfo = users.map(user => {
      const expiryDate = calculateExpiryDate(user.membershipStartDate, user.membershipType);
      const isExpired = isMembershipExpired(user.membershipStartDate, user.membershipType);
      
      return {
        ...user.toObject(),
        membershipExpiryDate: expiryDate,
        isExpired: isExpired
      };
    });
    
    res.json(usersWithExpiryInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.membershipType = req.body.membershipType || user.membershipType;
      user.membershipStartDate = req.body.membershipStartDate || user.membershipStartDate;

      const updatedUser = await user.save();
      
      const expiryDate = calculateExpiryDate(updatedUser.membershipStartDate, updatedUser.membershipType);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        membershipType: updatedUser.membershipType,
        membershipStartDate: updatedUser.membershipStartDate,
        membershipExpiryDate: expiryDate
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await Booking.deleteMany({ user: req.user._id });
    
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserMembership,
  deleteUserAccount, 
};