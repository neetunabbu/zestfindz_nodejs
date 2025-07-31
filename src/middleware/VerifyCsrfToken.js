const csrf = require('csurf');

// Create CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Define URIs to exclude from CSRF protection (like Laravel's $except array)
const excludedRoutes = [
  // Example: '/api/webhook', '/public/submit', etc.
];

const verifyCsrfTokenMiddleware = (req, res, next) => {
  // If current path is in the excluded list, skip CSRF check
  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  // Otherwise, apply CSRF protection
  return csrfProtection(req, res, next);
};

module.exports = {
  verifyCsrfTokenMiddleware,
};
