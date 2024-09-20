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
// Get all events with pagination
exports.getAllEvents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10

  try {
    const events = await Event.find()
      .populate('attendees', 'name email')
      .limit(limit * 1) // Limit the results
      .skip((page - 1) * limit) // Skip previous pages' events
      .exec(); // Execute the query

    // Get the total number of documents in the events collection
    const count = await Event.countDocuments();

    res.status(200).json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
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
    // Populate attendees' name and email
    const myEvents = await Event.find({ creator: req.user._id })
      .populate('attendees', 'name email'); // Populate attendees with name and email

    if (!myEvents || myEvents.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json(myEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get event by ID (with populated attendees)
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate('attendees', 'name email').populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// If you need to populate attendees in getAllEvents as well
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('attendees', 'name email').populate('attendees', 'name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RSVP to an event
exports.rsvpEvent = async (req, res) => {
  const { id } = req.params; // Event ID
  const userId = req.user._id; // Logged-in user ID

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the event is already fully booked
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Check if the user has already RSVP'd
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    // Add user to attendees array
    event.attendees.push(userId);

    await event.save();

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Check if user RSVP'd to an event
exports.checkRsvpStatus = async (req, res) => {
  const { id } = req.params; // Event ID
  const userId = req.user._id; // Logged-in user ID

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is in the attendees list
    const hasRsvp = event.attendees.includes(userId);

    res.status(200).json({ hasRsvp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the list of RSVP'd attendees
exports.getRsvpAttendees = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate('attendees', 'name email'); // Populate the user info

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event.attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





