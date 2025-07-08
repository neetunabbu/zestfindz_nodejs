// src/helpers/apiResponse.js

const successResponse = (res, message = '', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    status: true,
    message,
    data
  });
};

const errorResponse = (res, statusCode = 'ERROR', message = '', httpCode = 500) => {
  return res.status(httpCode).json({
    timestamp: new Date().toISOString(),
    status: false,
    statusCode,
    message
  });
};

const requestErrorResponse = (res, statusCode = 'ERROR', message = '', params = {}, httpCode = 500) => {
  return res.status(httpCode).json({
    timestamp: new Date().toISOString(),
    status: false,
    statusCode,
    message,
    params
  });
};

module.exports = {
  successResponse,
  errorResponse,
  requestErrorResponse
};
