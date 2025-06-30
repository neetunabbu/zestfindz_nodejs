// D:\zestfindz\src\middleware\mockAuth.js

module.exports = (req, res, next) => {
  req.user = {
    id: 1,
    roles: [{ name: 'admin' }] // or [{ name: 'manager' }]
  };
  console.log('🔐 mockAuth attached user:', req.user);
  next();
};
