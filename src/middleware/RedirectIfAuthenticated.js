const { RouteServiceProvider } = require('../Providers/RouteServiceProvider');
const { ApiResponse } = require('../Traits/ApiResponse'); // Optional: useful for consistent response format
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Adjust path as needed

const RedirectIfAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (user) {
        return res.redirect(RouteServiceProvider.HOME); // e.g., '/dashboard'
      }
    }

    // Not authenticated, proceed to next middleware/route
    next();
  } catch (err) {
    // Invalid token or error - continue to next
    next();
  }
};

module.exports = RedirectIfAuthenticated;
