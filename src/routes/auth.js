// src\routes\auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/Api/v1/dashboard/Auth/auth');

// Register
router.post('/register', authController.ensureSession, authController.register);

// Login
router.post('/login', authController.ensureSession, authController.login);

// Protected route example
router.get('/me', authController.ensureSession, authController.me);

//   me(req, res) {
//     if (!req.session || !req.session.userId) return res.status(401).json({ message: 'Not authenticated' });
//     res.json({ message: 'You are authenticated', userId: req.session.userId });
//   }

module.exports = router;
