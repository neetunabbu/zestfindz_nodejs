// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
// usage example.   
// const generateToken = require('./utils/generateToken');
// const token = generateToken(user.id);            
// console.log(token); // This will print the JWT token
// Note: Ensure that you have set the JWT_SECRET in your .env file
// Example .env entry
// JWT_SECRET=your_secret_key_here