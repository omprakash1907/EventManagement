const express = require('express');
const { createEvent, getAllEvents, editEvent, deleteEvent } = require('../controllers/eventController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

const router = express.Router();

// Create event (protected route)
router.post('/create', authMiddleware, upload.single('image'), createEvent);

// Get all events (public route)
router.get('/', getAllEvents);

// Edit event (protected route)
router.put('/:id', authMiddleware, upload.single('image'), editEvent);

// Delete event (protected route)
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
