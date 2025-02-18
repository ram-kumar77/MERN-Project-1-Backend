const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

const seedTickets = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/eventplatform');

    // Find a user and some events
    const user = await User.findOne();
    const events = await Event.find();

    // Create dummy tickets
    const dummyTickets = [
      {
        user: user._id,
        event: events[0]._id,
        quantity: 2,
        paymentMethod: 'credit',
        totalPrice: events[0].ticketPrice * 2,
        purchaseDate: new Date('2023-05-01')
      },
      {
        user: user._id,
        event: events[1]._id,
        quantity: 1,
        paymentMethod: 'paypal',
        totalPrice: events[1].ticketPrice,
        purchaseDate: new Date('2023-06-15')
      }
    ];

    await Ticket.insertMany(dummyTickets);
    console.log('Dummy tickets seeded successfully');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

seedTickets();
