require('dotenv').config();

const token = process.env.DELHIVERY_API_TOKEN;

module.exports = {
  token: token,
  mode: process.env.DELHIVERY_MODE || 'test',
  baseUrl: process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com',
  client: process.env.DELHIVERY_CLIENT || 'Manoj',
  headers: {
    Authorization: `Token ${token}`,
    Accept: 'application/json',
  },
};
