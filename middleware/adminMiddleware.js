const adminMiddleware = (req, res, next) => {
    // Assuming req.user is set by authMiddleware
    if (req.user.role !== 'user') { // Allow users with 'user' role
      return res.status(403).json({ message: 'Access denied. User access required.' });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  