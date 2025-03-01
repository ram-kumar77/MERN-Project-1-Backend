const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Increase limit to 10MB
});

const app = express();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(upload.single('image')); // Use multer middleware for file uploads

// Routes
app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/events', eventRoutes);
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', userRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


