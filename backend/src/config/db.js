const mongoose = require('mongoose');
const Config = require('.');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Connection already exists, reuse it
  }
  try {
    await mongoose.connect(Config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Updated: maxPoolSize is the correct option
    });
    console.log('Database connected 🚀');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

module.exports = connectDB;
