const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email già registrata' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrazione avvenuta con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      membershipType: user.membershipType,
    };

    res.json({ user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout effettuato con successo' });
};

module.exports = { registerUser, loginUser, logoutUser };