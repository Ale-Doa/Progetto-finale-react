const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    // Log the connection string format (without showing credentials)
    console.log(`Connecting to MongoDB with URI scheme: ${mongoURI.split('://')[0]}`);
    
    // Set mongoose options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;