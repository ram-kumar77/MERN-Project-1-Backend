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
    location: 'Chennai, TN',
    ticketPrice: 200,
    date: new Date('2024-06-20'),
    image: 'https://i0.wp.com/liveclefs.com/wp-content/uploads/classified-listing/2024/09/hiphop-tamizha-booking-price.jpg?fit=1440%2C960&ssl=1'
  },
  {
    title: 'Startup Singam 2024',
    description: 'Competition for early-stage startups to pitch to investors',
    location: 'Chennai, TN',
    ticketPrice: 122,
    date: new Date('2024-04-10'),
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*3dyIWSm1sKew82I3mhEpXA.jpeg'
  },

  {
    title: "Street Food Festival 2025",
    description: "Explore Indian cuisines with renowned chefs and food trucks",
    location: "Pune, India",
    ticketPrice: 100,
    date: new Date("2025-07-10"),
    image: "https://i.ytimg.com/vi/BLsQyx604Yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAYWKCLjjwlIHVaM6MGC9bvpVLe_A",
  },
  {
    title: "Night Nation",
    description: "Enjoy the Best DJ and Make the moments memorable and vivid of vibes",
    location: "Goa, India",
    ticketPrice: 100,
    date: new Date("2024-09-05"),
    image: "https://imgmediagumlet.lbb.in/media/2022/12/6392d66eb869c97ea869e863_1670567534943.jpg",
  },
  {
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop for beginners and professionals in AI",
    location: "Seattle, WA",
    ticketPrice: 150,
    date: new Date("2024-10-22"),
    image: "https://healthandcareresearchwales.org/sites/default/files/styles/large/public/2023-11/AI_research.png?h=1e6eb8d0&itok=jBWJ2XTx",
  },
  {
    title: "Wild Life Photography Masterclass",
    description: "Learn from professional photographers in a live session",
    location: "Sundarbans National Park, India",
    ticketPrice: 150,
    date: new Date("2024-11-12"),
    image: "https://images.squarespace-cdn.com/content/v1/6253c0a34c71c941801fde7c/46f442a7-dae9-4aed-924d-facdef2cd0fe/Photography-workshops-lead.jpg",
  },

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
