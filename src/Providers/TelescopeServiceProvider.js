// src/Providers/TelescopeServiceProvider.js
const expressStatusMonitor = require('express-status-monitor');
const appEnvironment = process.env.NODE_ENV || 'development';

function hideSensitiveRequestDetails(app) {
    if (appEnvironment === 'development') return;

    app.use((req, res, next) => {
        if (req.body && req.body._token) delete req.body._token;

        ['cookie', 'x-csrf-token', 'x-xsrf-token'].forEach((header) => {
            if (req.headers[header]) {
                delete req.headers[header];
            }
        });

        next();
    });
}

function register(app) {
    hideSensitiveRequestDetails(app);

    if (appEnvironment === 'development') {
        app.use(expressStatusMonitor());
    } else {
        app.use((req, res, next) => {
            const shouldLog =
                res.statusCode >= 500 ||
                req.method === 'POST' && req.url.includes('/job') ||
                req.url.includes('/scheduler') ||
                req.headers['x-debug-tag'];

            if (shouldLog) {
                console.log(`[FilteredLog] ${req.method} ${req.url} - ${res.statusCode}`);
            }
            next();
        });
    }
}

function viewTelescopeGate(user) {
    const allowedEmails = ['admin@example.com']; // add real emails
    return user && allowedEmails.includes(user.email);
}

module.exports = {
    register,
    viewTelescopeGate,
};
