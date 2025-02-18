const adminMiddleware = (req, res, next) => {
    // Assuming req.user is set by authMiddleware
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  