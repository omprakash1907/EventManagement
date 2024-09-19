const express = require('express');
const { createEvent, getAllEvents, editEvent, deleteEvent, getMyEvents, getEventById } = require('../controllers/evevntController');
const upload = require('../middleware/upload'); // Import Multer middleware
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();




// Create an event (with image upload)
router.post('/create', authMiddleware, upload.single('image'), createEvent);

// Get all events (public route)
router.get('/', getAllEvents);

// Get events created by the logged-in user
router.get('/my-events', authMiddleware, getMyEvents); 

// Edit an event (with image upload)
router.put('/:id', authMiddleware, upload.single('image'), editEvent);

// Delete an event
router.delete('/:id', authMiddleware, deleteEvent);

// get event by ID
router.get('/:id', authMiddleware, getEventById);

module.exports = router;
