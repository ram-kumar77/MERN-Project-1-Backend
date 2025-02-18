const jwt = require('jsonwebtoken');
const User = require('../models/User');



const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

    try {
      console.log('Verifying token with secret:', process.env.JWT_SECRET);
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      if (!decoded) {
        throw new Error('Failed to decode token');
      }
      
      // Verify token payload structure
      if (!decoded.userId) {
        throw new Error('Invalid token payload: missing userId');
      }
      
      // Check token expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new Error('Token has expired');
      }
      
      // Verify user exists in database
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Add user from payload
      req.user = { 
        id: decoded.userId,
        email: user.email,
        role: user.role
      };
      
      console.log('Authenticated user:', req.user);
      next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

// Admin role middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { 
  authMiddleware, 
  adminMiddleware 
};