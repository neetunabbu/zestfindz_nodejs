const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const expectsJson = req.headers.accept && req.headers.accept.includes('application/json');
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    if (expectsJson) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    } else {
      return res.redirect('/login');
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (expectsJson) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    } else {
      return res.redirect('/login');
    }
  }
};

module.exports = authenticate;
