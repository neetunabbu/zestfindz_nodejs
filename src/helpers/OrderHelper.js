const { Sequelize, Op } = require('sequelize');
const LoggableMixin = require('./loggableMixin');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Helper for order-related operations
const OrderHelper = (sequelize) => {
  const OrderModel = sequelize.models.Order;
  const ShopModel = sequelize.models.Shop;
  const DeliveryPriceModel = sequelize.models.DeliveryPrice;
  const StockModel = sequelize.models.Stock;
  const ProductModel = sequelize.models.Product;
  const WholeSalePriceModel = sequelize.models.WholeSalePrice;
  const UserModel = sequelize.models.User;
  const CouponModel = sequelize.models.Coupon;
  const SettingsModel = sequelize.models.Settings;
  const UserAddressModel = sequelize.models.UserAddress;

  return {
    // Check shop delivery and calculate delivery fee
    async checkShopDelivery(shop, data, lang = 'en', deliveryFee = []) {
      LoggableMixin.error(new Error(`[OrderHelper] checkShopDelivery called: shop_id=${shop?.id}, delivery_price_id=${data?.delivery_price_id}`));

      try {
        if (!shop?.id) {
          throw new Error(`Error 435: Shop not provided`);
        }

        const deliveryPrice = await this.deliveryPrice(shop, parseInt(data?.delivery_price_id), lang);
        LoggableMixin.error(new Error(`[OrderHelper] Delivery price calculated: ${JSON.stringify(deliveryPrice)}`));

        deliveryFee.push(deliveryPrice);
        LoggableMixin.error(new Error(`[OrderHelper] Added delivery fee: ${JSON.stringify(deliveryPrice)}`));

        return deliveryFee;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in checkShopDelivery: ${error.message}`));
        throw error;
      }
    },

    // Calculate delivery price for a shop
    async deliveryPrice(shop, deliveryPriceId, lang) {
      LoggableMixin.error(new Error(`[OrderHelper] deliveryPrice called: shop_id=${shop.id}, delivery_price_id=${deliveryPriceId}`));

      try {
        const deliveryPrice = await DeliveryPriceModel.findOne({ where: { id: deliveryPriceId } });
        LoggableMixin.error(new Error(`[OrderHelper] Fetched delivery price: ${JSON.stringify(deliveryPrice)}`));

        return {
          shop_id: shop.id,
          price: deliveryPrice?.price || 0.0
        };
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in deliveryPrice: ${error.message}`));
        throw error;
      }
    },

    // Calculate actual quantity for stock
    async actualQuantity(stock, quantity, bonus = false) {
      LoggableMixin.error(new Error(`[OrderHelper] actualQuantity called: stock_id=${stock?.id}, quantity=${quantity}, bonus=${bonus}`));

      try {
        const product = await stock.getProduct();

        if (!quantity) {
          return 0;
        }

        if (!bonus && quantity < (product?.min_qty || 0)) {
          quantity = product.min_qty;
        } else if (!bonus && quantity > (product?.max_qty || 0)) {
          quantity = product.max_qty;
        }

        return quantity > stock.quantity ? Math.max(stock.quantity, 0) : quantity;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in actualQuantity: ${error.message}`));
        throw error;
      }
    },

    // Set item parameters
    async setItemParams(item, stock) {
      LoggableMixin.error(new Error(`[OrderHelper] setItemParams called: stock_id=${stock?.id}`));

      try {
        const quantity = parseInt(item.quantity || 0);
        const preparedItem = await this.prepareByBonus(item, stock, quantity);

        return {
          origin_price: dataGet(preparedItem, 'origin_price', 0),
          tax: dataGet(preparedItem, 'tax', 0),
          discount: dataGet(preparedItem, 'discount', 0),
          total_price: dataGet(preparedItem, 'total_price', 0),
          stock_id: stock.id,
          replace_stock_id: dataGet(item, 'replace_stock_id'),
          replace_quantity: dataGet(item, 'replace_quantity'),
          replace_note: dataGet(item, 'replace_note'),
          note: dataGet(item, 'note'),
          quantity,
          bonus: dataGet(item, 'bonus', false)
        };
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in setItemParams: ${error.message}`));
        throw error;
      }
    },

    // Prepare item based on bonus
    async prepareByBonus(item, stock, quantity) {
      LoggableMixin.error(new Error(`[OrderHelper] prepareByBonus called: stock_id=${stock?.id}, quantity=${quantity}`));

      try {
        if (dataGet(item, 'bonus')) {
          item.origin_price = 0;
          item.total_price = 0;
          item.tax = 0;
          item.discount = 0;
          return item;
        }

        const price = stock?.price || 0;
        const discount = (stock?.actual_discount || 0) * quantity;
        const tax = (stock?.tax_price || 0) * quantity;

        const wholeSalePrice = await WholeSalePriceModel.findOne({
          where: {
            stock_id: stock.id,
            min_quantity: { [Op.lte]: quantity },
            max_quantity: { [Op.gte]: quantity }
          }
        });

        let finalPrice = price;
        let finalDiscount = discount;
        let finalTax = tax;

        if (wholeSalePrice) {
          finalPrice = wholeSalePrice.price;
          finalDiscount = 0;
          finalTax = 0;
        }

        finalPrice *= quantity;

        item.origin_price = finalPrice;
        item.total_price = finalPrice - finalDiscount + finalTax;
        item.tax = finalTax;
        item.discount = finalDiscount;

        return item;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in prepareByBonus: ${error.message}`));
        throw error;
      }
    },

    // Update stock and product statistics
    async updateStatCount(stock, actualQuantity, isIncrement = true) {
      LoggableMixin.error(new Error(`[OrderHelper] updateStatCount called: stock_id=${stock?.id}, actualQuantity=${actualQuantity}, isIncrement=${isIncrement}`));

      try {
        if (!stock) {
          return;
        }

        const quantity = isIncrement
          ? stock.quantity - (actualQuantity || stock.quantity)
          : stock.quantity + (actualQuantity || stock.quantity);
        const oCount = Math.max((stock.o_count || 0) + (isIncrement ? 1 : -1), 0);
        const odCount = Math.max((stock.od_count || 0) + (isIncrement ? 1 : -1), 0);

        await stock.update({
          quantity: Math.max(quantity, 0),
          o_count: oCount,
          od_count: odCount
        });

        const product = await stock.getProduct();
        if (product) {
          await product.update({
            o_count: oCount,
            od_count: odCount
          });
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in updateStatCount: ${error.message}`));
        throw error;
      }
    },

    // Update user order statistics
    async updateUserOrderStat(order) {
      LoggableMixin.error(new Error(`[OrderHelper] updateUserOrderStat called: order_id=${order.id}`));

      try {
        const orders = await OrderModel.findAll({
          where: { user_id: order.user_id },
          attributes: ['id', 'user_id', 'total_price']
        });

        const user = await order.getUser();
        if (user) {
          await user.update({
            o_count: orders.length,
            o_sum: orders.reduce((sum, ord) => sum + (ord.total_price || 0), 0)
          });
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in updateUserOrderStat: ${error.message}`));
        throw error;
      }
    },

    // Check and apply coupon
    async checkCoupon(data, shopId, totalPrice, rate, couponPrice = [], deliveryFee = []) {
      LoggableMixin.error(new Error(`[OrderHelper] checkCoupon called: shop_id=${shopId}, totalPrice=${totalPrice}, rate=${rate}`));

      try {
        const name = dataGet(data, `coupon.${shopId}`);
        const deliveryFeeItem = deliveryFee.find(fee => fee.shop_id === shopId);
        const deliveryFeePrice = deliveryFeeItem?.price || 0;

        if (!name) {
          return couponPrice;
        }

        const coupon = await CouponModel.findOne({
          where: { name, shop_id: shopId }
        });

        if (!coupon) {
          return couponPrice;
        }

        let price = 0;
        if (coupon.for === 'delivery_fee') {
          price = await this.couponPrice(data, coupon, deliveryFeePrice, rate);
        } else if (coupon.for === 'total_price') {
          price = await this.couponPrice(data, coupon, totalPrice, rate);
        }

        if (price > 0) {
          couponPrice.push({
            shop_id: shopId,
            price,
            coupon
          });
        }

        return couponPrice;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in checkCoupon: ${error.message}`));
        return couponPrice;
      }
    },

    // Calculate coupon price
    async couponPrice(data, coupon, totalPrice, rate) {
      LoggableMixin.error(new Error(`[OrderHelper] couponPrice called: coupon_name=${coupon.name}, totalPrice=${totalPrice}, rate=${rate}`));

      try {
        const checkCoupon = await sequelize.models.OrderCoupon.findOne({
          where: {
            user_id: dataGet(data, 'user_id', data.userId),
            name: coupon.name
          }
        });

        if (checkCoupon || coupon.qty <= 0) {
          return 0;
        }

        const couponPrice = coupon.type === 'percent'
          ? (totalPrice / 100) * coupon.price
          : coupon.price;

        return couponPrice > 0 ? couponPrice * rate : 0;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in couponPrice: ${error.message}`));
        return 0;
      }
    },

    // Check if phone is required for delivery
    async checkPhoneIfRequired(data, lang = 'en') {
      LoggableMixin.error(new Error(`[OrderHelper] checkPhoneIfRequired called: user_id=${data?.user_id}, delivery_type=${data?.delivery_type}`));

      try {
        const userId = dataGet(data, 'user_id');
        const existPhone = await UserModel.findOne({
          where: { id: userId, phone: { [Op.ne]: null } }
        });

        const phoneRequired = await SettingsModel.findOne({
          where: { key: 'before_order_phone_required' }
        });

        let myAddress = null;
        if (data.address_id) {
          myAddress = await UserAddressModel.findByPk(data.address_id);
        }

        if (
          data.delivery_type === OrderModel.DELIVERY &&
          myAddress?.phone
        ) {
          return;
        }

        if (
          data.delivery_type === OrderModel.DELIVERY &&
          phoneRequired?.value &&
          (!existPhone && !dataGet(data, 'phone'))
        ) {
          throw new Error(`Error 117: Phone is required for delivery`);
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderHelper] Error in checkPhoneIfRequired: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = OrderHelper;