// PreventRequestsDuringMaintenance.js

/**
 * Middleware to block requests when the app is in maintenance mode,
 * except for some specified routes.
 */

const maintenanceMode = false; // Set this to `true` to enable maintenance mode

const exceptRoutes = [
  // Add any routes that should be accessible during maintenance
  // Example: '/health-check'
];

const preventRequestsDuringMaintenance = (req, res, next) => {
  if (maintenanceMode && !exceptRoutes.includes(req.path)) {
    return res.status(503).json({
      message: 'The application is in maintenance mode. Please try again later.',
    });
  }

  next(); // Continue to the next middleware if not in maintenance or route is allowed
};

module.exports = preventRequestsDuringMaintenance;
