// D:\zestfindz\app.js

const express = require('express');
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Mock Auth Middleware for Testing (you can replace with JWT later)
const mockAuth = require('./src/middleware/mockAuth');
app.use((req, res, next) => {
    try {
        mockAuth(req, res, () => {
            // Log to verify that user is attached by mockAuth
            console.log('✅ mockAuth ran — user:', req.user);
            next();
        });
    } catch (err) {
        console.error('❌ Mock Auth Middleware error:', err);
        return res.status(500).json({ message: 'Mock authentication failed' });
    }
});

// ✅ Home Route
app.get('/', (req, res) => {
    res.send('✅ Welcome to Zestfindz API');
});

// ✅ User Routes
const adminUserRoutes = require('./src/routes/api/v1/Dashboard/admin/user.routes');
app.use('/api/admin/users', adminUserRoutes);

// ✅ Role Routes
const adminRoleRoutes = require('./src/routes/api/v1/Dashboard/admin/role.routes');
app.use('/api/admin/roles', adminRoleRoutes);

// ✅ Export the app
module.exports = app;
