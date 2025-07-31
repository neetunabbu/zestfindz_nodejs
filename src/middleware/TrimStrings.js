// src/middleware/TrimStrings.js

// Middleware to trim request body strings, except certain fields

const TrimStrings = (req, res, next) => {
    const except = ['current_password', 'password', 'password_confirmation'];

    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (
                Object.prototype.hasOwnProperty.call(req.body, key) &&
                typeof req.body[key] === 'string' &&
                !except.includes(key)
            ) {
                req.body[key] = req.body[key].trim();
            }
        }
    }

    next();
};

module.exports = TrimStrings;
