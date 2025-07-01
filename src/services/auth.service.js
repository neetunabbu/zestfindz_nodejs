// ✅ auth.service.js
const UserService = require('./user.service');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const ResponseError = {
  NO_ERROR: 'NO_ERROR',
  ERROR_400: 'ERROR_400',
  ERROR_401: 'ERROR_401',
  ERROR_403: 'ERROR_403',
  ERROR_404: 'ERROR_404',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

const UserResource = (userInstance) => {
  if (!userInstance) return null;
  return {
    id: userInstance.id,
    uuid: userInstance.uuid,
    firstname: userInstance.firstname,
    lastname: userInstance.lastname,
    email: userInstance.email,
    phone: userInstance.phone,
    img: userInstance.img,
    active: userInstance.active,
    created_at: userInstance.createdAt,
    updated_at: userInstance.updatedAt,
  };
};

class AuthService {
  constructor() {
    this.userService = UserService;
  }

  async register(userData) {
    try {
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

      const serviceResult = await this.userService.createUser(userData);
      if (!serviceResult.status || !serviceResult.success) {
        return serviceResult;
      }

      const user = serviceResult.data;
      const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key-for-dev';
      const userPayload = { id: user.id, uuid: user.uuid, email: user.email };
      const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

      const appEmitter = require('../events/eventEmitter');
      const EVENT_TYPES = require('../events/eventTypes');
      appEmitter.emit(EVENT_TYPES.USER_REGISTERED, { user: UserResource(user), registrationSource: 'api_registration' });

      return {
        status: true,
        success: true,
        code: ResponseError.NO_ERROR,
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          user: UserResource(user)
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
        include: ['roles']
      });

      if (!user) {
        return { status: false, success: false, code: ResponseError.ERROR_404, message: 'Invalid credentials: User not found.' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { status: false, success: false, code: ResponseError.ERROR_401, message: 'Invalid credentials: Password incorrect.' };
      }

      if (!user.active) {
        return { status: false, success: false, code: ResponseError.ERROR_403, message: 'Account is not active.' };
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key-for-dev';
      const userPayload = { 
        id: user.id, 
        uuid: user.uuid, 
        email: user.email,
        roles: user.roles?.map(r => r.name) || []
      };
      const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

      return {
        status: true,
        success: true,
        code: ResponseError.NO_ERROR,
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          user: UserResource(user)
        },
        message: 'Login successful.'
      };

    } catch (error) {
      logger.error(`AuthService.login error: ${error.message}`, { stack: error.stack });
      return { status: false, success: false, code: ResponseError.ERROR_400, message: error.message || 'Login failed.' };
    }
  }
}

module.exports = new AuthService();
