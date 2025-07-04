// D:\zestfindz\src\middleware\mockAuth.js
// src/middleware/mockAuth.js
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
module.exports = async (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

    // const token = authHeader.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Needs JWT_SECRET set

    // const user = await User.findByPk(decoded.id, {
    //   include: [{ model: Role, as: 'roles' }]
    // });

    // if (!user) return res.status(404).json({ message: 'User not found' });

    // req.user = {
    //   id: user.id,
    //   roles: user.roles.map(r => r.name)
    // };

    next();
  } catch (error) {
    console.error('❌ mockAuth error:', error);
    return res.status(401).json({ message: error.message || 'Invalid token' });
  }
};

// module.exports = (req, res, next) => {
//   req.user = {
//     id: 1,
//     roles: [{ name: 'admin' }] // or [{ name: 'manager' }]
//   };
//   console.log('🔐 mockAuth attached user:', req.user);
//   next();
// };
