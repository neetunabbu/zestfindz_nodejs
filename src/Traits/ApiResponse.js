const { StatusCodes } = require('http-status-codes');

// Utility functions for standardized API responses
const ApiResponse = {
  // Success Response
  successResponse: (res, message = '', data = null) => {
    return res.status(StatusCodes.OK).json({
      timestamp: new Date().toISOString(),
      status: true,
      message,
      data
    });
  },

  // Error Response
  errorResponse: (res, statusCode, message = '', httpCode = StatusCodes.INTERNAL_SERVER_ERROR) => {
    return res.status(httpCode).json({
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      message
    });
  },

  // Request Error Response
  requestErrorResponse: (res, statusCode, message = '', params = [], httpCode = StatusCodes.INTERNAL_SERVER_ERROR) => {
    return res.status(httpCode).json({
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      message,
      params
    });
  }
};

module.exports = ApiResponse;