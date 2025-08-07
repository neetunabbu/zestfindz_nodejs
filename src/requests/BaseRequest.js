
const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      if (!formattedErrors[error.param]) {
        formattedErrors[error.param] = [];
      }
      formattedErrors[error.param].push(error.msg);
    });

    return res.status(422).json({
      code: 400,
      message: 'Validation Failed',
      errors: formattedErrors,
    });
  }

  next();
}

module.exports = validateRequest;
