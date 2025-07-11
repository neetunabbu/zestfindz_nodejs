const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('./apiResponse');

// Constants for error codes (replace with your actual error codes)
const RESPONSE_ERRORS = {
  ERROR_101: 'ERROR_101', // Generic error
  ERROR_404: 'ERROR_404'  // Not found
};

// Utility function to mimic Laravel's __ translation helper
const translate = (key, params = {}, locale = 'en') => {
  // Placeholder: Implement translation logic based on your i18n setup (e.g., i18next)
  let message = key;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    message = message.replace(`:${paramKey}`, paramValue);
  }
  return message;
};

// Mixin for response handling
const OnResponse = {
  // Handle error response
  onErrorResponse: (res, result = {}) => {
    const code = result.code || RESPONSE_ERRORS.ERROR_101;
    const httpDefault = code === RESPONSE_ERRORS.ERROR_404 ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST;
    const http = result.http || httpDefault;
    const data = result.data || {};
    const locale = res.locals.language || 'en'; // Assumes language is set in middleware or defaults to 'en'

    return ApiResponse.errorResponse(
      res,
      String(code),
      String(result.message || translate(`errors.${code}`, data, locale)),
      http
    );
  }
};

module.exports = OnResponse;