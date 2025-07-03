// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' }); 
  
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'roles' }]
    });
    if (!user) return res.status(401).json({ message: 'User not found' });
    console.log("Incoming Token:", req.headers.authorization);
      console.log("Decoded Token:", decoded);
      console.log("Loaded User:", user?.email);
    req.user = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      roles: user.roles || []
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// existing 
// const jwt = require('jsonwebtoken');
// const { User, Role } = require('../models');

// const auth = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findByPk(decoded.id, { include: ['roles'] });
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = auth;
