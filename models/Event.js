const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String, // This can be a URL or a buffer depending on how you want to store the image
    required: false // Make it optional for now
  }
});

module.exports = mongoose.model('Event', eventSchema);
