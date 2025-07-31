// src/middleware/TrustHosts.js

// Middleware to trust specific host patterns

const TrustHosts = (req, res, next) => {
    const trustedHosts = [
        getAllSubdomainsOfApplicationUrl(), // mimic Laravel method
    ];

    const host = req.headers.host;

    if (host && trustedHosts.some(pattern => new RegExp(pattern).test(host))) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Untrusted Host' });
    }
};

// Mimic Laravel's allSubdomainsOfApplicationUrl()
function getAllSubdomainsOfApplicationUrl() {
    const appUrl = process.env.APP_URL || 'example.com';
    const hostname = appUrl.replace(/^https?:\/\//, '');
    return `^(.+\\.)?${hostname.replace('.', '\\.')}$`;
}

module.exports = TrustHosts;
