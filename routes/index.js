const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Event Routes
router.post('/events', [authMiddleware, adminMiddleware], eventController.createEvent);
router.get('/events', authMiddleware, eventController.getAllEvents);

// Booking Routes
router.post('/bookings', authMiddleware, bookingController.createBooking);

module.exports = router;