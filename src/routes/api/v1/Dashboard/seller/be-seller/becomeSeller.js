const express = require('express');
const router = express.Router();

const { registerPhoneOtp,verifyPhoneOtp,completeProfile,getProfile,fetchGSTFromPAN } = require('../../../../../../controllers/Api/v1/dashboard/seller/BecomeSeller');
const verifyToken = require('../../../../../../middleware/verifyToken');

router.post('/register-phone-otp-be-seller', registerPhoneOtp);
router.post('/verify-phone-otp-be-seller', verifyPhoneOtp);


router.post('/complete-profile-data-be-seller',verifyToken, completeProfile);
router.post('/get-profile-data-be-seller',verifyToken, getProfile);
router.get('/get-gst-address-with-pan-zoop', fetchGSTFromPAN);



module.exports = router;

