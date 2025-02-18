const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateRegisterInput = (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'your_jwt_secret', 
    { expiresIn: '1d' }
  );
};

// Admin Registration Validation
const validateAdminRegisterInput = (req, res, next) => {
  const { name, email, password, adminKey } = req.body;
  const errors = [];

  // Admin key validation
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    errors.push('Invalid admin key');
  }

  // Standard validation
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Register User
exports.register = [
  validateRegisterInput,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log('Registration request received:', req.body);

      // Check if user already exists
      console.log('Checking for existing user with email:', email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists',
          errors: ['Email is already registered'] 
        });
      }

      // Hash password
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Default role for regular registration
      const role = 'user' ;

      // Create new user with explicit role assignment
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
      });

      console.log('User object before save:', newUser);
      console.log('Saving user to database...');
      await newUser.save();
      console.log('User saved successfully:', newUser);

      // Generate token
      const token = generateToken(newUser);

      res.status(201).json({
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ 
        message: 'Server error during registration', 
        errors: [error.message] 
      });
    }
  }
];

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        errors: ['Email and password are required'] 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials',
        errors: ['User not found'] 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid credentials',
        errors: ['Incorrect password'] 
      });
    }

    // Admin-specific validation
    if (isAdmin && user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access denied',
        errors: ['Not authorized as admin'] 
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      errors: [error.message] 
    });
  }
};
