// src/middleware/TrustProxies.js

// NOTE: Express handles proxies differently from Laravel.
// We'll configure trusted proxies using Express settings.

const trustProxiesMiddleware = (app) => {
    // This enables trust for all proxies — similar to Laravel's $proxies = '*';
    // You can also pass an array of IPs if needed (e.g., ['loopback', 'linklocal', 'uniquelocal'])
    app.set('trust proxy', true);

    // If you want to mimic Laravel's trusted headers setup, Express does this internally
    // when 'trust proxy' is enabled. So you don't need to manually handle headers like:
    // X-Forwarded-For, X-Forwarded-Host, etc.
};

module.exports = {
    trustProxiesMiddleware,
};
