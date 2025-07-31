// src/middleware/SanctumCheck.js

const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../Traits/ApiResponse');
const { ResponseError } = require('../helpers/ResponseError');

const SanctumCheck = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ApiResponse.errorResponse(
        res,
        ResponseError.ERROR_100,
        req.query.lang || 'en',
        401
      );
    }

    // Replace 'your_jwt_secret' with your actual JWT secret
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return ApiResponse.errorResponse(
          res,
          ResponseError.ERROR_100,
          req.query.lang || 'en',
          401
        );
      }

      // Attach decoded user data to request
      req.user = decoded;
      next();
    });

  } catch (error) {
    return ApiResponse.errorResponse(
      res,
      ResponseError.ERROR_100,
      req.query.lang || 'en',
      401
    );
  }
};

module.exports = SanctumCheck;
