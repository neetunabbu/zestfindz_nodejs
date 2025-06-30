const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

// Simple session fallback for dev (not for production)
function ensureSession(req, res, next) {
  if (!req.session) req.session = {};
  next();
}

module.exports = {
  ensureSession,

  async register(req, res) {
    try {
      const { uuid, firstname, lastname, email, phone, password } = req.body;
      if (!uuid || !firstname || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        uuid,
        firstname,
        lastname,
        email,
        phone,
        password: hashed
      });
      req.session.userId = user.id;
      res.json({ message: 'Registered successfully', user: { id: user.id, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid email or password' });
      req.session.userId = user.id;
      res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  me(req, res) {
    if (!req.session || !req.session.userId) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ message: 'You are authenticated', userId: req.session.userId });
  }
};
