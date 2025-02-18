const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

const sampleEvents = [
  {
    title: 'Tech Conference 2024',
    description: 'Annual technology conference featuring industry leaders',
    location: 'San Francisco, CA',
    ticketPrice: 299,
    date: new Date('2024-05-15'),
    image: 'https://pbs.twimg.com/media/GI_P23kbUAA9iQb.jpg:large'
  },
  {
    title: 'Hip Hop Tamizha Concert',
    description: 'Three-day outdoor music festival with top artists',
    location: 'Austin, TX',
    ticketPrice: 199,
    date: new Date('2024-06-20'),
    image: 'https://i0.wp.com/liveclefs.com/wp-content/uploads/classified-listing/2024/09/hiphop-tamizha-booking-price.jpg?fit=1440%2C960&ssl=1'
  },
  {
    title: 'Startup Singam 2024',
    description: 'Competition for early-stage startups to pitch to investors',
    location: 'New York, NY',
    ticketPrice: 99,
    date: new Date('2024-04-10'),
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*3dyIWSm1sKew82I3mhEpXA.jpeg'
  }
];

const seedEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log('Inserted sample events:', createdEvents);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
