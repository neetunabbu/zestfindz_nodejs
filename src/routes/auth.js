const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');

// Register
router.post('/register', authController.ensureSession, authController.register);

// Login
router.post('/login', authController.ensureSession, authController.login);

// Protected route example
router.get('/me', authController.ensureSession, authController.me);

module.exports = router;
