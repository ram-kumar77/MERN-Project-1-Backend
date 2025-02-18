const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();
const { login, register } = require('../controllers/authController');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id; // Use id from the decoded token

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Return user data with success status
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate JWT Token Function
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register Route
router.post('/register',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Registration request received:', req.body);
      
      const { name, email, password,role } = req.body;

      // Check if user already exists
      console.log('Checking for existing user with email:', email);
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      console.log('Creating new user...');
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role 
      });

      console.log('Saving user to database...');
      await newUser.save();
      console.log('User saved successfully:', newUser);

      // Generate token
      console.log('Generating token...');
      const token = generateToken(newUser);

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: { 
          id: newUser._id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        }
      });
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      res.status(500).json({ 
        message: 'Registration failed', 
        error: error.message 
      });
    }
  }
);

// Login Route
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, isAdmin } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check admin access if required
      if (isAdmin && user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access denied' });
      }

      // Validate password
      console.log('Comparing passwords:', { 
        inputPassword: password,
        storedHash: user.password 
      });
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }


      // Generate token with user details
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

      console.log('Login successful for user:', {
        id: user._id,
        email: user.email,
        role: user.role
      });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
