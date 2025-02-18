const express = require('express');
const Event = require('../models/Event');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all events
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching events from database...');
    const events = await Event.find({}).sort({ date: 1 });
    console.log('Events fetched successfully:', events);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events',
      error: error.message 
    });
  }
});

module.exports = router;
