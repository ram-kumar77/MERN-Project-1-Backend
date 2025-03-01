const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { authMiddleware } = require('../middleware/authMiddleware');

// Purchase tickets
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    console.log('Purchase request body:', req.body);
    const { eventId, quantity, paymentMethod, ticketType, userDetails } = req.body;
    
    if (!eventId || !quantity || !paymentMethod || !ticketType || !userDetails) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['eventId', 'quantity', 'paymentMethod', 'ticketType', 'userDetails']
      });
    }

    // Find event
    console.log('Fetching event:', eventId);
    const event = await Event.findById(eventId);
    console.log('Found event:', event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check availability
    if (event.availableTickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Create ticket
    const ticket = new Ticket({
      user: req.user.id,
      event: eventId,
      quantity,
      paymentMethod,
      totalPrice: event.ticketPrice * quantity,
      ticketType, // New field
      userDetails // New field
    });

    // Update event available tickets
    event.availableTickets -= quantity;
    await event.save();

    console.log('Saving ticket:', ticket);
    await ticket.save();
    console.log('Ticket saved successfully');

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Ticket purchase error:', error); // Log the error details
    res.status(500).json({ 
      message: 'Ticket purchase failed', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user tickets
router.get('/user', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching tickets for user:', req.user.id);
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event')
      .sort({ 'event.date': 1 });
    console.log('Found tickets:', tickets);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error });
  }
});

// Cancel ticket
router.delete('/:ticketId', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.ticketId,
      user: req.user.id
    }).populate('event');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Restore available tickets for the event
    await Event.findByIdAndUpdate(ticket.event._id, {
      $inc: { availableTickets: ticket.quantity }
    });

    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling ticket', error });
  }
});

module.exports = router;
