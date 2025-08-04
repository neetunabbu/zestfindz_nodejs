// src/app/observers/OrderObserver.js

const { Order } = require('../../models/Order');
const Language = require('../../models/Language');
const Settings = require('../../models/Settings');
const AttachDeliveryMan = require('../../jobs/AttachDeliveryMan');
const ModelLogService = require('../../services/ModelLogService/ModelLogService');

// Called when Order is created
const orderCreated = async (order) => {
  try {
    if (
      order.status === Order.STATUS_READY &&
      !order.deliveryman &&
      await autoDeliveryMan()
    ) {
      const lang = await getLanguage();
      AttachDeliveryMan.dispatchAfterResponse(order, lang);
    }

    await ModelLogService.logging(order, order, 'created');
  } catch (error) {
    console.error('Error in orderCreated:', error);
  }
};

// Called when Order is updated
const orderUpdated = async (order) => {
  try {
    if (
      order.status === Order.STATUS_READY &&
      !order.deliveryman &&
      await autoDeliveryMan()
    ) {
      const lang = await getLanguage();
      AttachDeliveryMan.dispatchAfterResponse(order, lang);
    }

    await ModelLogService.logging(order, order, 'updated');
  } catch (error) {
    console.error('Error in orderUpdated:', error);
  }
};

// Called when Order is deleted
const orderDeleted = async (order) => {
  try {
    await ModelLogService.logging(order, order, 'deleted');
  } catch (error) {
    console.error('Error in orderDeleted:', error);
  }
};

// Called when Order is restored
const orderRestored = async (order) => {
  try {
    await ModelLogService.logging(order, order, 'restored');
  } catch (error) {
    console.error('Error in orderRestored:', error);
  }
};

// Get current language or fallback default
const getLanguage = async () => {
  const langFromRequest = global.requestLang || null; // assume you set requestLang in middleware
  if (langFromRequest) return langFromRequest;

  const defaultLang = await Language.findOne({ where: { default: true }, attributes: ['locale'] });
  return defaultLang?.locale || 'en';
};

// Check if auto deliveryman is enabled
const autoDeliveryMan = async () => {
  const setting = await Settings.findOne({ where: { key: 'order_auto_delivery_man' } });
  return parseInt(setting?.value || 0) === 1;
};

module.exports = {
  orderCreated,
  orderUpdated,
  orderDeleted,
  orderRestored
};
