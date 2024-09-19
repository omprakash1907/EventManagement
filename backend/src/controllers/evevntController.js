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
      creator: req.user._id, 
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

    // Ensure the user requesting the update is the event's creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.maxAttendees = maxAttendees;

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
  const { id } = req.params; // Event ID from URL parameters

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Logged-in user ID:', req.user._id);
    console.log('Event creator ID:', event.creator);

    // Ensure the user requesting the deletion is the event's creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete the event
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get events created by the logged-in user
exports.getMyEvents = async (req, res) => {
  try {
    // Find events where the creator matches the logged-in user's ID
    const myEvents = await Event.find({ creator: req.user._id });
    
    if (!myEvents) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json(myEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate('creator', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


