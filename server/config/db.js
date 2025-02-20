const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Tentativo di connessione al database:', process.env.MONGODB_URI);
    if (!process.env.MONGODB_URI) {
      console.error('Errore: MONGODB_URI non definito');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI); // Rimuovi useNewUrlParser e useUnifiedTopology
    console.log('Database connesso con successo');
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    process.exit(1);
  }
};

module.exports = connectDB;