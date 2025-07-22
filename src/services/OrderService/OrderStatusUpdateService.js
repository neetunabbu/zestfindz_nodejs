// File: src/services/OrderService/OrderStatusUpdateService.js

const { Op } = require('sequelize');
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const WalletHistory = require('../../models/WalletHistory');
const PointHistory = require('../../models/PointHistory');
const Language = require('../../models/Language');
const Translation = require('../../models/Translation');
const NotificationUser = require('../../models/NotificationUser');
const PushNotification = require('../../models/PushNotification');
const Shop = require('../../models/Shop');
const { ResponseError } = require('../../helpers/ResponseError');
const { WalletHistoryService } = require('../WalletHistoryService/WalletHistoryService');
const { EmailSendService } = require('../EmailSettingService/EmailSendService');
const { sendNotification } = require('../../traits/Notification');
const { paymentRefund } = require('../../traits/PaymentRefund');
const PayReferral = require('../../jobs/PayReferral');
const DelhiveryService = require('../DelhiveryService/DelhiveryService');
const OrderRefundService = require('./OrderRefundService');
const logger = require('../../config/logger');
const CoreService = require('../CoreService');

class OrderStatusUpdateService {
  constructor(language = 'en') {
    this.language = language;
  }

  async statusUpdate(order, data, isDelivery = false) {
    const status = data.status;
    logger.info('OrderStatusUpdateService: statusUpdate called', {
      order_id: order.id,
      current_status: order.status,
      new_status: status,
      user_id: order.user_id,
      data,
      isDelivery
    });

    if (order.status === status) {
      logger.warn('OrderStatusUpdateService: Status is already set', {
        order_id: order.id,
        status
      });
      return {
        status: false,
        code: ResponseError.ERROR_252,
        message: `errors.${ResponseError.ERROR_252}`
      };
    }

    try {
      await this.updateNotes(order, data);

      // Delhivery Integration
      if (status === 'ready') {
        const delhivery = new DelhiveryService();
        const waybill = await delhivery.getWaybills(1);

        if (waybill) {
          const warehouse = order.shop?.location;
          let address = order.myAddress;
          if (Array.isArray(address) && address.length === 1) {
            address = address[0];
          }

          const pickupLocationName = warehouse?.warehouse_address || `${order.shop?.seller?.firstname} ${order.shop?.seller?.lastname}`;

          const payload = {
            pickup_location: {
              add: warehouse?.warehouse_address || 'Default',
              city: warehouse?.warehouse_city || '',
              country: 'India',
              name: warehouse?.warehouse_name,
              phone: warehouse?.warehouse_phone || '',
              pin: warehouse?.warehouse_zipcode || '',
              state: warehouse?.warehouse_state || '',
              email: warehouse?.warehouse_email || '',
              end_date: new Date(Date.now() + 7 * 86400000).toISOString()
            },
            shipments: [
              {
                waybill,
                end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
                name: `${order.user?.firstname} ${order.user?.lastname}`,
                order: order.id.toString(),
                products_desc: order.orderDetails?.map(p => p.product?.translation?.title).join(', ') || 'General',
                order_date: new Date().toISOString(),
                payment_mode: order.transaction?.paymentSystem?.tag === 'cash' ? 'COD' : 'Prepaid',
                total_amount: order.total_price,
                cod_amount: order.transaction?.paymentSystem?.tag === 'cash' ? order.total_price : 0,
                add: address?.address,
                city: address?.city || '',
                state: address?.state || '',
                country: 'India',
                phone: address?.phone || order.user?.phone,
                pin: address?.zipcode,
                return_add: warehouse?.location || '',
                return_city: warehouse?.city || '',
                return_country: 'India',
                return_name: pickupLocationName,
                return_phone: order.shop?.seller?.phone,
                return_pin: warehouse?.zipcode || '',
                return_state: warehouse?.state || '',
                seller_name: `${order.shop?.seller?.firstname} ${order.shop?.seller?.lastname}`,
                seller_add: warehouse?.location || '',
                category_of_goods: 'General',
                invoice_reference: order.id.toString(),
                weight: '1000.0 gm',
                quantity: 1
              }
            ]
          };

          logger.info('Payload for Delhivery shipment', { order_id: order.id, waybill, payload });
          const shipmentResponse = await delhivery.createShipment(payload);

          if (!shipmentResponse?.success || shipmentResponse?.packages?.[0]?.status !== 'Success') {
            logger.error('Delhivery shipment failed', { order_id: order.id, response: shipmentResponse });
            return {
              status: false,
              code: ResponseError.ERROR_400,
              message: `Delhivery shipment creation failed: ${shipmentResponse?.rmk || 'Unknown error'}`
            };
          }

          logger.info('Delhivery shipment created successfully', { order_id: order.id, response: shipmentResponse });

          await Shipment.upsert({
            order_id: order.id,
            waybill,
            upload_wbn: shipmentResponse.upload_wbn,
            status: shipmentResponse.packages?.[0]?.status,
            payment_type: shipmentResponse.packages?.[0]?.payment,
            cod_amount: shipmentResponse.packages?.[0]?.cod_amount || 0,
            serviceable: shipmentResponse.packages?.[0]?.serviceable,
            refnum: shipmentResponse.packages?.[0]?.refnum,
            client: shipmentResponse.packages?.[0]?.client,
            remarks: shipmentResponse.packages?.[0]?.remarks || [],
            success: shipmentResponse.success,
            response: shipmentResponse
          });
        } else {
          logger.error('Delhivery waybill creation failed', { order_id: order.id });
        }
      }

      // To be continued with DB transaction logic, cashback, email service and final updates...
    } catch (error) {
      logger.error('OrderStatusUpdateService: Exception in statusUpdate', {
        order_id: order.id,
        error: error.message
      });

      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async updateNotes(order, data) {
    try {
      const existingNote = order.notes?.find(n => n.status === data.status)?.notes || [];
      const updatedNotes = data.notes?.reduce((acc, val) => {
        val.created_at = val.created_at || new Date().toISOString();
        acc.push(val);
        return acc;
      }, existingNote) || existingNote;

      await order.updateNoteByStatus(data.status, updatedNotes);
    } catch (e) {
      throw new Error(`${e.message} ${e.stack}`);
    }
  }
}

module.exports = { OrderStatusUpdateService };
