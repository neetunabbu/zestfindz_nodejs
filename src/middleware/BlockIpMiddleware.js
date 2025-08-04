const pathToRegexp = require('path-to-regexp');

const allowRoutes = [
  'api/v1/install/*',
  'api/v1/rest/*',
  'api/v1/dashboard/galleries/*',
  'api/v1/auth/*',
  'api/v1/webhook/*',
];

const matchRoute = (url) => {
  return allowRoutes.some((pattern) => {
    const regex = pathToRegexp(pattern);
    return regex.test(url);
  });
};

const BlockIpMiddleware = async (req, res, next) => {
  try {
    const blockedIps = ['::1', '127.0.0.1']; // Temporary block list for local testing
    const clientIp = req.ip || req.connection.remoteAddress;

    if (!matchRoute(req.originalUrl) && blockedIps.includes(clientIp)) {
      return res.status(403).json({ message: 'Access Denied: IP Blocked' });
    }

    next();
  } catch (err) {
    console.error('BlockIpMiddleware error:', err.message);
    res.status(500).json({ message: 'Server Error in IP Middleware' });
  }
};

module.exports = BlockIpMiddleware;
