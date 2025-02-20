const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Tentativo di connessione al database:', process.env.MONGODB_URI); // Logga l'URL del database
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('Database connesso con successo');
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    process.exit(1); // Termina il processo in caso di errore
  }
};

module.exports = connectDB;