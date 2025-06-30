// D:\zestfindz\app.js

const express = require('express');
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Home Route
app.get('/', (req, res) => {
    res.send('✅ Welcome to Zestfindz API');
});

// ✅ User Routes
const adminUserRoutes = require('./src/routes/api/v1/Dashboard/admin/user.routes');
const adminRoleRoutes = require('./src/routes/api/v1/Dashboard/admin/role.routes');
const authRoutes = require("./src/routes/auth.js");

// ✅ Mock Auth Middleware for Testing (apply only to admin routes)
const mockAuth = require('./src/middleware/mockAuth');
app.use('/api/admin', (req, res, next) => {
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

// Mount admin routes after mockAuth
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/roles', adminRoleRoutes);

// Auth routes (no mockAuth)
app.use('/api/auth', authRoutes);

app.get('/test', (req, res) => {
    console.log("testing");
    res.json({ message: '✅ Test route is working!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ✅ Export the app
module.exports = app;
