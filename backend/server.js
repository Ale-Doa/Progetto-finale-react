const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Encode MongoDB password if needed
if (process.env.MONGO_URI) {
  // Extract parts of the connection string
  const [prefix, rest] = process.env.MONGO_URI.split('://');
  const [credentials, remainder] = rest.split('@');
  const [username, password] = credentials.split(':');
  
  // Reconstruct with encoded password
  const encodedPassword = encodeURIComponent(password);
  process.env.MONGO_URI = `${prefix}://${username}:${encodedPassword}@${remainder}`;
}

// Import connectDB after encoding the password
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://my-gym-app-react.netlify.app'],
  credentials: true
}));
app.use(express.json());

// Routes
// Import routes
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/announcements', announcementRoutes);

// Error handling middleware
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
