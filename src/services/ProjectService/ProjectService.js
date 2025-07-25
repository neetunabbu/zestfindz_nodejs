// src/services/project/project.service.js

const axios = require('axios');
const { Shop } = require('../../models');
const BaseService = require('../core.service');
const os = require('os');

class ProjectService extends BaseService {
  constructor() {
    super(Shop);
    this.url = 'https://demo.githubit.com/api/v2/server/notification';
  }

  /**
   * Check license activation key.
   * @param {string|null} code 
   * @param {string|null} id 
   * @returns {Promise<string|boolean>}
   */
  async activationKeyCheck(code = null, id = null) {
    if (!this.checkLocal()) {
      const params = {
        code: code || process.env.PURCHASE_CODE,
        id: id || process.env.PURCHASE_ID,
        ip: this.getServerIp(),
        host: this.getHost()
      };

      try {
        const response = await axios.post(this.url, params);
        return JSON.stringify(response.data);
      } catch (error) {
        console.error('Activation check failed:', error.message);
        return false;
      }
    }

    return JSON.stringify({
      local: true,
      active: true,
      key: process.env.PURCHASE_CODE,
    });
  }

  /**
   * Determines if app is running locally.
   * @returns {boolean}
   */
  checkLocal() {
    const remoteAddr = this.decode('UkVNT1RFX0FERFI=');
    const httpHost = this.decode('SFRUUF9IT1NU');

    const remote = process.env[remoteAddr] || '127.0.0.1';
    const host = process.env[httpHost] || 'localhost';

    return (
      remote === '127.0.0.1' ||
      host === 'localhost' ||
      host.startsWith('10.') ||
      host.startsWith('192.168')
    );
  }

  decode(b64) {
    return Buffer.from(b64, 'base64').toString('utf-8');
  }

  getServerIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '127.0.0.1';
  }

  getHost() {
    return process.env.APP_HOST || 'localhost';
  }
}

module.exports = new ProjectService();
