const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { User, CustomerVerify  } = require('../models');
const { Op } = require('sequelize');

// Helper to send SMS (mocked for demo)
async function sendOtpSms(phone, otp) {
    const message = `Your ZestFindz OTP for login is ${otp}. valid for 5 mins. Do not share it for security reason. If not you, contact support@zestfindz.com`;
    // Replace with actual SMS API call
    return axios.get('http://45.114.143.23/api/mt/SendSMS', {
        params: {
            user: 'Zestfindz',
            password: '123456',
            senderid: 'ZFINDZ',
            channel: 'Trans',
            DCS: 0,
            flashsms: 0,
            number: phone,
            text: message,
            route: '07',
            peid: '1001205663839976585',
            dlttemplateid: '1007911338993901240',
        }
    });
}

module.exports = {
    // POST /v1/register-new-user-phone
    async registerPhoneOtp(req, res) {
        const { phone } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        let user = await User.findOne({ where: { phone } });
        if (user && user.password) {
            return res.status(422).json({ success: false, message: "User Already Exists Do Login" });
        }
        if (!user) {
            user = await User.create({
                phone,
                uuid: uuidv4(),
            });
        } else {
            await user.update({ uuid: uuidv4() });
        }
        try {
            const smsResponse = await sendOtpSms(phone, otp);
            if (smsResponse.status !== 200) {
                return res.status(500).json({ success: false, error: 'Failed to send SMS', details: smsResponse.data });
            }
        } catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
        await user.update({ verify_token: otp });
        return res.json({
            success: true,
            message: 'OTP sent to Phone',
            phone,
            user_id: user.id
        });
    },

    // POST /v1/verify-phone-otp
    async verifyPhoneOtp(req, res) {
        const { user_id, otp } = req.body;
        if (!user_id || !otp) {
            return res.status(422).json({ success: false, message: 'user_id and otp are required' });
        }
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.verify_token != otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }
        await user.update({ verify_token: null });
        return res.json({ success: true, message: 'OTP verified successfully', user_id, phone: user.phone });
    },

    // POST /v1/register-customer-data
    async registerUserCustomer(req, res) {
        try {
            const { user_id, firstName, lastName, email, password, referal_code } = req.body;
            if (!user_id || !firstName || !lastName || !password) {
                return res.status(422).json({ success: false, message: 'Missing required fields' });
            }
            // Find user by ID (make sure user_id is correct and numeric)
            const userIdInt = parseInt(user_id, 10);
            if (isNaN(userIdInt)) {
                return res.status(422).json({ success: false, message: 'Invalid user_id' });
            }
            const user = await User.findByPk(userIdInt);
            // if (!user) return res.status(404).json({ success: false, message: 'User not found' });
                  if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: `User with ID ${user_id} not found. Register phone first.`
                    });
                    }
            // Email uniqueness check
            if (email) {
                const emailExists = await User.findOne({ where: { email, id: { [Op.ne]: user_id } } });
                if (emailExists) {
                    return res.status(422).json({ success: false, message: 'Email already taken' });
                }
            }
            
            await user.update({
                firstname: firstName,
                lastname: lastName,
                email,
                password: await bcrypt.hash(password, 10),
            });

            // Handle referral
            // if (referal_code) {
            //     const ref = await ReferalZestfindz.findOne({ where: { code: referal_code } });
            //     if (ref) {
            //         await ReferedUser.upsert({
            //             refered_person_id: user_id ? user_id : "",
            //             ref_by_id: ref.user_id,
            //             person_name: `${firstName} ${lastName}`
            //         });
            //     }
            // }

            // Generate referral code for this user (mocked)
            // const myReferral = uuidv4().slice(0, 8).toUpperCase();
            // await ReferalZestfindz.create({ user_id, code: myReferral });
            // await user.update({ my_referral: myReferral });

            return res.json({
                success: true,
                message: 'User updated successfully.',
                user
            });
           
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /v1/user-forgot-password
    async forgotPasswordSendOtp(req, res) {
            try {
                const { phone } = req.body;

                if (!phone) {
                    return res.status(422).json({ success: false, message: 'Phone is required' });
                }

                const user = await User.findOne({ where: { phone } });

                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                const otp = Math.floor(100000 + Math.random() * 900000);

                const smsResponse = await sendOtpSms(phone, otp);

                if (smsResponse.status !== 200) {
                    return res.status(500).json({ success: false, error: 'Failed to send SMS', details: smsResponse.data });
                }

                await user.update({ verify_token: otp });

                return res.json({
                    success: true,
                    message: 'OTP sent to phone for password reset.',
                    user_id: user.id
                });

            } catch (error) {
                console.error('forgotPasswordSendOtp error:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
            }
    },


    // POST /v1/reset-password-with-otp
    async resetPasswordWithOtp(req, res) {
        try {
            const { user_id, otp, password, password_confirmation } = req.body;

            if (!user_id || !otp || !password) {
                return res.status(422).json({ success: false, message: 'Missing required fields' });
            }

            if (password !== password_confirmation) {
                return res.status(422).json({ success: false, message: 'Password confirmation does not match' });
            }

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (user.verify_token != otp) {
                return res.status(401).json({ success: false, message: 'Invalid OTP' });
            }

            await user.update({
                password: await bcrypt.hash(password, 10),
                verify_token: null,
            });

            return res.json({ success: true, message: 'Password reset successfully.' });

        } catch (error) {
            console.error('resetPasswordWithOtp error:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    },


    // GET /v1/customer-verify-status
    async CustomerVerifyStatusGet(req, res) {
        try {
            const { user_id } = req.query;

            if (!user_id) {
                return res.status(422).json({ success: false, message: 'user_id is required' });
            }

            const verifyStatus = await CustomerVerify.findOne({ where: { user_id } });

            // If not found, assume verified (backward compatibility or default behavior)
            if (!verifyStatus) {
                return res.json({ success: true, verified: 1 });
            }

            return res.json({ success: true, verified: verifyStatus.status });

        } catch (error) {
            console.error('CustomerVerifyStatusGet error:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }

};
