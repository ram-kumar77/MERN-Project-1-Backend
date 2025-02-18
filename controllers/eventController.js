const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      location, 
      capacity, 
      price, 
      category 
    } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      availableSeats: capacity,
      price,
      category,
      organizer: req.user.id
    });

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating event', 
      error: error.message 
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .select('-__v');

    res.json(events);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error.message 
    });
  }
};