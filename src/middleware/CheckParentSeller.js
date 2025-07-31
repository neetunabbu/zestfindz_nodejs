// Import required helpers (you need to create or convert these)
const { onErrorResponse } = require('../helpers/ApiResponse'); // Convert ApiResponse trait
const ResponseError = require('../helpers/ResponseError'); // Convert ResponseError class
const cache = require('../utils/cache'); // You MUST create this like Laravel Cache

module.exports = async function checkParentSeller(req, res, next) {
    try {
        // Simulate Laravel's Cache::get('rjkcvd.ewoidfh')
        const cachedData = await cache.get('rjkcvd.ewoidfh');

        // If no cache or not active, abort with 403
        if (!cachedData || cachedData.active !== 1) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Auth check (based on your JWT/auth strategy)
        if (!req.user) {
            return res.status(401).json(onErrorResponse({ code: ResponseError.ERROR_100 }));
        }

        // All good, go next
        next();
    } catch (err) {
        console.error('CheckParentSeller Middleware Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
