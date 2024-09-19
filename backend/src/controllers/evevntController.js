const Event = require('../models/event');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;
  
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      maxAttendees,
      creator: req.user._id, // Assume req.user contains authenticated user data
      image: req.file ? `/uploads/${req.file.filename}` : '', // Save image URL
    });
    
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit event
exports.editEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, maxAttendees } = req.body;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only allow event creator to edit the event
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.maxAttendees = maxAttendees;
    
    // Update image if a new one is uploaded
    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
