const express = require('express');
const router = express.Router();
const userLoginController = require('../../../controllers/Api/v1/dashboard/Auth/userLoginController');

// Register new user phone (send OTP)
router.post('/register-new-user-phone', userLoginController.registerPhoneOtp);

// Verify phone OTP
router.post('/verify-phone-otp', userLoginController.verifyPhoneOtp);

// Register customer data
router.post('/register-customer-data', userLoginController.registerUserCustomer);

// Forgot password (send OTP)
router.post('/user-forgot-password', userLoginController.forgotPasswordSendOtp);

// Reset password with OTP
router.post('/reset-password-with-otp', userLoginController.resetPasswordWithOtp);

// Get customer verify status
router.get('/customer-verify-status', userLoginController.CustomerVerifyStatusGet);

module.exports = router;
