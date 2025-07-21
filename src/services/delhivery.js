const axios = require('axios');
const config = require('../config/delhivery');

const headers = {
  Authorization: `Token ${config.token}`,
  Accept: 'application/json',
};

class DelhiveryService {
  async checkPincode(pincode) {
    const url = `${config.baseUrl}/c/api/pin-codes/json`;
    const res = await axios.get(url, {
      headers,
      params: { token: config.token, filter_codes: pincode },
    });
    return res.data;
  }

  async calculateShippingCharges(params) {
    const url = `${config.baseUrl}/api/kinko/v1/invoice/charges/.json`;
    const res = await axios.get(url, {
      headers,
      params: {
        md: params.mode || 'S',
        ss: params.shipment_type || 'DTO',
        o_pin: params.origin,
        d_pin: params.destination,
        cgm: params.weight,
      },
    });
    return res.data;
  }

  async createWarehouse(data) {
    const url = `${config.baseUrl}/api/backend/clientwarehouse/create/`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  }

  async editWarehouse(data) {
    const url = `${config.baseUrl}/api/backend/clientwarehouse/edit/`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  }

  async getWaybills(count = 1) {
    const url = `${config.baseUrl}/waybill/api/bulk/json`;
    const res = await axios.get(url, {
      headers,
      params: { token: config.token, cl: config.client, count },
    });
    return res.data;
  }

  async createShipment(payload) {
    const url = `${config.baseUrl}/api/cmu/create.json`;
    const formData = new URLSearchParams();
    formData.append('format', 'json');
    formData.append('data', JSON.stringify(payload));

    const res = await axios.post(url, formData, {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data;
  }

  async createReturnShipment(payload) {
    const url = `${config.baseUrl}/api/cmu/return/create.json`;
    const formData = new URLSearchParams();
    formData.append('format', 'json');
    formData.append('data', JSON.stringify(payload));

    const res = await axios.post(url, formData, {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data;
  }

  async getPackingSlip(waybill) {
    const url = `${config.baseUrl}/api/p/packing_slip`;
    const res = await axios.get(url, {
      headers,
      params: {
        wbns: waybill,
        pdf: 'true',
        pdf_size: '4R',
      },
    });

    return res.data;
  }

  async trackShipment(waybill) {
    const url = `${config.baseUrl}/api/v1/packages/json`;
    const res = await axios.get(url, {
      headers,
      params: { waybill, token: config.token },
    });

    return res.data;
  }

  async cancelShipment(data) {
    const url = `${config.baseUrl}/api/p/edit`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  }

  async updateShipment(data) {
    const url = `${config.baseUrl}/api/p/edit`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  }

  async pickupRequest(data) {
    const url = `${config.baseUrl}/fm/request/new/`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  }
}

module.exports = new DelhiveryService();
