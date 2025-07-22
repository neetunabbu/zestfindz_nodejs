// src/services/DelhiveryService/DelhiveryService.js
const axios = require('axios');
const config = require('../../config/config');
const logger = require('../../helpers/logger');

class DelhiveryService {
  constructor() {
    this.token = config.delhivery.token;
    this.baseUrl = config.delhivery.base_url;
    this.client = config.delhivery.client;
  }

  headers() {
    return {
      'Authorization': 'Token ' + this.token,
      'Accept': 'application/json'
    };
  }

  async checkPincode(pincode) {
    const url = `${this.baseUrl}/c/api/pin-codes/json`;
    const response = await axios.get(url, {
      headers: this.headers(),
      params: {
        token: this.token,
        filter_codes: pincode
      }
    });
    return response.data;
  }

  async calculateShippingCharges(params) {
    logger.info('Calculating shipping charges', { params });
    const url = `${this.baseUrl}/api/kinko/v1/invoice/charges/.json`;
    const response = await axios.get(url, {
      headers: this.headers(),
      params: {
        md: params.mode || 'S',
        ss: params.shipment_type || 'Forward',
        o_pin: params.origin,
        d_pin: params.destination,
        cgm: params.weight
      }
    });
    logger.info('Shipping charges API response', {
      status: response.status,
      body: response.data
    });
    return response.data;
  }

  async createWarehouse(data) {
    const url = `${this.baseUrl}/api/backend/clientwarehouse/create/`;
    const response = await axios.post(url, data, {
      headers: this.headers()
    });
    return response.data;
  }

  async editWarehouse(data) {
    const url = `${this.baseUrl}/api/backend/clientwarehouse/edit/`;
    const response = await axios.post(url, data, {
      headers: this.headers()
    });
    return response.data;
  }

  async getWaybills(count = 1) {
    const url = `${this.baseUrl}/waybill/api/bulk/json`;
    const response = await axios.get(url, {
      headers: this.headers(),
      params: {
        token: this.token,
        cl: this.client,
        count: count
      }
    });
    return response.data;
  }

  async createShipment(manifestPayload) {
    const url = `${this.baseUrl}/api/cmu/create.json`;
    const payload = new URLSearchParams();
    payload.append('format', 'json');
    payload.append('data', JSON.stringify(manifestPayload));

    logger.info('Creating shipment', { payload: Object.fromEntries(payload) });

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': 'Token ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  }

  async getPackingSlip(waybill) {
    const url = `${this.baseUrl}/api/p/packing_slip?wbns=${waybill}`;
    const response = await axios.get(url, {
      headers: this.headers()
    });

    if (response.status === 200) {
      return response.data;
    }

    logger.error('Failed to fetch packing slip', {
      status: response.status,
      body: response.data
    });
    return null;
  }

  async trackShipment(waybill) {
    const url = `${this.baseUrl}/api/v1/packages/json`;
    const response = await axios.get(url, {
      headers: this.headers(),
      params: {
        waybill: waybill,
        token: this.token
      }
    });
    return response.data;
  }

  async cancelOrder(data) {
    const url = `${this.baseUrl}/api/p/edit`;
    const response = await axios.post(url, data, {
      headers: this.headers()
    });
    return response.data;
  }

  async pickupRequest(data) {
    const url = `${this.baseUrl}/fm/request/new/`;
    const response = await axios.post(url, data, {
      headers: this.headers()
    });
    return response.data;
  }
}

module.exports = DelhiveryService;
