const mongoose = require('mongoose');
const Config = require('.');

const url = Config.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // Timeout after 5s if MongoDB server isn't found
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log('Database Connected 🚀🚀');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

module.exports = connectDB;
