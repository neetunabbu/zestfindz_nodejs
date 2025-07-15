
const express = require('express');
const app = express();
require('dotenv').config(); 
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.get('/', (req, res) => {
    res.send('✅ Welcome to Zestfindz API');
});

const adminUserRoutes = require('./src/routes/api/v1/Dashboard/admin/user.routes');
const adminRoleRoutes = require('./src/routes/api/v1/Dashboard/admin/role.routes');
const authRoutes = require("./src/routes/auth");

// ✅ Mock Auth Middleware 
const mockAuth = require('./src/middleware/mockAuth');


app.use('/api/admin', (req, res, next) => {
    try {
        mockAuth(req, res, () => {
            next();
        });
    } catch (err) {
        console.error('❌ Mock Auth Middleware error:', err);
        return res.status(500).json({ message: 'Mock authentication failed' });
    }
});

app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin', adminRoleRoutes);
app.use('/api/be-seller', adminRoleRoutes);

app.use('/api/v1/auth', authRoutes);



const userLoginRoutes = require('./src/routes/api/v1/userLogin.routes');
app.use('/api/v1/auth', userLoginRoutes);

const restRoutes = require('./src/routes/api/v1/rest.routes');
app.use('/api/v1/rest', restRoutes);

const apiRoutes = require('./src/routes/api/v1/Dashboard/seller/apiRoutes');
app.use('/api/v1/seller', apiRoutes);

app.get('/test', (req, res) => {
    console.log("testing");
    res.json({ message: '✅ Test route is working!' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

