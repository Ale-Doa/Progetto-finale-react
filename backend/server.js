const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { checkExpiredMemberships } = require('./middleware/cleanupMiddleware');

dotenv.config();

if (process.env.MONGO_URI) {
  const [prefix, rest] = process.env.MONGO_URI.split('://');
  const [credentials, remainder] = rest.split('@');
  const [username, password] = credentials.split(':');
  
  const encodedPassword = encodeURIComponent(password);
  process.env.MONGO_URI = `${prefix}://${username}:${encodedPassword}@${remainder}`;
}

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://my-gym-app-react.netlify.app'],
  credentials: true
}));
app.use(express.json());

// Esegui il controllo degli abbonamenti scaduti all'avvio del server
app.use(checkExpiredMemberships);

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/announcements', announcementRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
