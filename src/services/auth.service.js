const UserService = require('./user.service'); // Assuming UserService is in the same directory or path is adjusted
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// ResponseError equivalent (simplified)
const ResponseError = {
    NO_ERROR: 'NO_ERROR',
    ERROR_400: 'ERROR_400', // Bad Request / General Error
    ERROR_401: 'ERROR_401', // Unauthorized
    ERROR_404: 'ERROR_404', // Not Found
    VALIDATION_ERROR: 'VALIDATION_ERROR',
};

// Simplified UserResource - should match structure expected by frontend after login/registration
const UserResource = (userInstance) => {
    if (!userInstance) return null;
    // Ensure to only include fields that are safe and useful for the client
    return {
        id: userInstance.id,
        uuid: userInstance.uuid,
        firstname: userInstance.firstname,
        lastname: userInstance.lastname,
        email: userInstance.email,
        phone: userInstance.phone,
        img: userInstance.img,
        active: userInstance.active,
        // role: userInstance.Roles ? userInstance.Roles.map(r => r.name)[0] : 'user', // Example if roles are loaded
        // wallet: userInstance.Wallet ? { balance: userInstance.Wallet.balance } : null, // Example if wallet is loaded
        created_at: userInstance.createdAt,
        updated_at: userInstance.updatedAt,
    };
};


class AuthService {
    constructor() {
        this.userService = UserService; // Using the imported instance
    }

    async register(userData) {
        try {
            // Check if user already exists (email or phone) - UserService.create might also do this.
            // For clarity, can do a quick check here or rely on DB constraints / service logic.
            const existingUserByEmail = await User.findOne({ where: { email: userData.email } });
            if (existingUserByEmail) {
                return { status: false, success: false, code: ResponseError.VALIDATION_ERROR, message: 'Email already exists.' };
            }
            if (userData.phone) {
                const existingUserByPhone = await User.findOne({ where: { phone: String(userData.phone).replace(/\D/g, '') } });
                if (existingUserByPhone) {
                    return { status: false, success: false, code: ResponseError.VALIDATION_ERROR, message: 'Phone already exists.' };
                }
            }
            
            // Call UserService to create the user
            // The data structure for userService.create should match what it expects
            const serviceResult = await this.userService.create(userData);

            if (!serviceResult.status || !serviceResult.success) {
                return serviceResult; // Pass along the error from UserService
            }

            const user = serviceResult.data;

            // Generate token for the new user (similar to loginAsUser in UserService)
            const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key-for-dev';
            const userPayload = { id: user.id, uuid: user.uuid, email: user.email };
            const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

            // Emit USER_REGISTERED event
            const appEmitter = require('../events/eventEmitter');
            const EVENT_TYPES = require('../events/eventTypes');
            appEmitter.emit(EVENT_TYPES.USER_REGISTERED, { user: UserResource(user), registrationSource: 'api_registration' });

            return {
                status: true, success: true,
                code: ResponseError.NO_ERROR,
                data: {
                    access_token: accessToken,
                    token_type: 'Bearer',
                    user: UserResource(user) // Format user data
                },
                message: 'User registered successfully.'
            };

        } catch (error) {
            logger.error(`AuthService.register error: ${error.message}`, { stack: error.stack });
            return { status: false, success: false, code: ResponseError.ERROR_400, message: error.message || 'Registration failed.' };
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ 
                where: { email },
                // include: [ Role ] // Include roles if needed for token payload or UserResource
            });

            if (!user) {
                return { status: false, success: false, code: ResponseError.ERROR_404, message: 'Invalid credentials: User not found.' };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { status: false, success: false, code: ResponseError.ERROR_401, message: 'Invalid credentials: Password incorrect.' };
            }

            if (!user.active) { // Assuming an 'active' field
                return { status: false, success: false, code: ResponseError.ERROR_403, message: 'Account is not active.' };
            }

            // Generate token
            const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key-for-dev';
            const userPayload = { 
                id: user.id, 
                uuid: user.uuid, 
                email: user.email,
                // role: user.Roles ? user.Roles.map(r => r.name)[0] : 'user' // Example
            };
            const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
            
            // Load necessary associations for UserResource if not already loaded
            // await user.reload({ include: [Role, UserWallet] }); // Example

            return {
                status: true, success: true,
                code: ResponseError.NO_ERROR,
                data: {
                    access_token: accessToken,
                    token_type: 'Bearer',
                    user: UserResource(user) // Format user data
                },
                message: 'Login successful.'
            };

        } catch (error) {
            logger.error(`AuthService.login error: ${error.message}`, { stack: error.stack });
            return { status: false, success: false, code: ResponseError.ERROR_400, message: error.message || 'Login failed.' };
        }
    }

    // TODO: Add other auth methods: logout, refreshToken, forgotPassword, resetPassword, verifyEmail
}

module.exports = new AuthService();
