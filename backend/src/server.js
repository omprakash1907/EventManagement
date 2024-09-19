const express = require('express');
const connectDB = require('./config/db');
const Config = require('./config');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const eventRouter = require('./routes/eventRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' directory
// Make sure to adjust the path since the 'uploads' folder is now inside 'src'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set the port from the environment or default to 5000
const PORT = Config.PORT || 5000;

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter); 

// Start the server and connect to the database
app.listen(PORT, (err) => {
  if (err) {
    console.log('Error starting the server:', err);
  }
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
