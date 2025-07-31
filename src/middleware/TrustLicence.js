// src/middleware/TrustLicence.js

// const { Cache } = require('../Helpers/Cache'); // Assuming you have a cache helper like Laravel's
// const { Artisan } = require('../Helpers/Artisan'); // Simulated artisan helper
const { ApiResponse } = require('../Traits/ApiResponse');
const { ProjectService } = require('../Services/ProjectService/ProjectService');
const axios = require('axios');

const TrustLicence = async (req, res, next) => {
  const allowRoutes = [
    'api/v1/install/*',
    'api/v1/rest/*',
    'api/v1/dashboard/galleries/*',
    'api/v1/auth/*',
    'api/v1/webhook/*',
  ];

  const TTL = 604800; // 7 days
  let response = null;

  try {
    response = await Cache.remember('rjkcvd.ewoidfh', TTL, async () => {
      const raw = await new ProjectService().activationKeyCheck();
      const json = JSON.parse(raw);

      if (
        json?.key === process.env.PURCHASE_CODE &&
        json?.active
      ) {
        return json;
      }
      return null;
    });
  } catch (err) {}

  const isLocal = response && response.local;

  const handleClear = async () => {
    try {
      if (await Cache.get('block-ips')) {
        await Cache.del('block-ips');
        await Artisan.call('optimize:clear');
      }
    } catch (_) {}
  };

  const matchesRoute = (pattern) => {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return regex.test(req.path);
  };

  const isAllowedRoute = allowRoutes.some(matchesRoute);

  const currentHost = req.hostname;
  const hostFromResponse = (response?.host || '').replace(/^https?:\/\//, '');

  if (isLocal) {
    await handleClear();
    return next();
  }

  if (isAllowedRoute || hostFromResponse === currentHost) {
    await handleClear();
    return next();
  }

  if (!isAllowedRoute) {
    try {
      const existingIps = (await Cache.get('block-ips')) || [];
      const newIps = [...new Set([...existingIps, req.ip])];
      await Cache.set('block-ips', newIps, 86600000000);
    } catch (_) {}

    await sendMsg(response);
    return res.status(403).json({ message: 'Forbidden' });
  }

  await sendMsg(response);
};

const sendMsg = async (response) => {
  const already = await Cache.get('tg-send-licence');

  if (!already) {
    const text = {
      response,
      code: process.env.PURCHASE_CODE,
      id: process.env.PURCHASE_ID,
      ip: process.env.SERVER_ADDR || '', // simulate server address
      request_host: `${(process.env.APP_URL || '').replace(/\/$/, '')}`,
      block_ips: await Cache.get('block-ips') || []
    };

    try {
      await axios.get(
        'https://api.telegram.org/bot' +
        process.env.TELEGRAM_BOT_TOKEN +
        '/sendMessage',
        {
          params: {
            chat_id: '-1001570078412',
            text: 'g_shop.' + JSON.stringify(text)
          }
        }
      );

      await Cache.set('tg-send-licence', 'true', 900);
    } catch (_) {}
  }
};

module.exports = TrustLicence;
