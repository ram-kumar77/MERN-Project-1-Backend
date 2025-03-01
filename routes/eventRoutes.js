const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events',
      error: error.message 
    });
  }
});

router.post('/', [authMiddleware], async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

// Update event (Admin only)
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error });
  }
});

// Get single event by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('Event not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    console.log('Event found:', event);
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      message: 'Error fetching event',
      error: error.message 
    });
  }
});

// Delete event (Admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event', error });
  }
});

module.exports = router;
