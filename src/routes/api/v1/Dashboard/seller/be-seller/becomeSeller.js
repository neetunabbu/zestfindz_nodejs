const express = require('express');
const router = express.Router();

const { registerPhoneOtp,verifyPhoneOtp } = require('../../../../../../controllers/seller/be-seller/BecomeSeller');

router.post('/register-phone-otp-be-seller', registerPhoneOtp);
router.post('/verify-phone-otp-be-seller', verifyPhoneOtp);



module.exports = router;
