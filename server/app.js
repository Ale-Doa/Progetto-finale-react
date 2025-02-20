require('dotenv').config();

console.log('Session Secret:', process.env.SESSION_SECRET); // Logga la chiave delle sessioni
console.log('MongoDB URI:', process.env.MONGODB_URI); // Logga l'URL del database

if (!process.env.SESSION_SECRET || !process.env.MONGODB_URI) {
  console.error('Errore: Variabili d\'ambiente mancanti');
  process.exit(1);
}

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// Connessione al database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Usa la variabile d'ambiente
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/admin', adminRoutes);

// Serve static files per React in produzione
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));