// src/Providers/RouteServiceProvider.js

const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../helpers/ApiResponse');
const ResponseError = require('../helpers/ResponseError');
const cache = require('../utils/cache');
const axios = require('axios');
const apiRoutes = require('../routes/api/v1/Dashboard/seller/apiRoutes');
// const webRoutes = require('../routes/web');
const express = require('express');

class RouteServiceProvider {
  static HOME = '/dashboard';

  static boot(app) {
    this.configureRateLimiting(app);

    // Web Routes
    app.use('/', webRoutes);

    // API Routes
    app.use('/api', apiRoutes);
  }

  static configureRateLimiting(app) {
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 5000,
      keyGenerator: (req) => {
        return (req.user?.id || req.ip);
      },
      handler: async (req, res) => {
        const blockedIps = cache.get('block-ips') || [];
        if (!blockedIps.includes(req.ip)) {
          blockedIps.push(req.ip);
          cache.set('block-ips', blockedIps, 86600000000);

          const throttleCache = cache.get('throttle');
          if (!throttleCache) {
            cache.set('throttle', true, 900);

            try {
              await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                params: {
                  chat_id: '-1001570078412',
                  text: `Throttle. id:${req.user?.id} ip:${req.ip} addr:${req.socket.localAddress}`,
                },
              });
            } catch (err) {
              console.error('Telegram API error', err.message);
            }
          }
        }

        return res.status(429).json(errorResponse(ResponseError.ERROR_429, `errors.${ResponseError.ERROR_429}`));
      },
    });

    app.use('/api', limiter);
  }
}

module.exports = RouteServiceProvider;
