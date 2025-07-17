// File: D:/zestfindz_nodejs/src/repositories/CartRepository/CartRepository.js

const { Op } = require('sequelize');
const Cart = require('../../models/Cart');
const Currency = require('../../models/Currency');
const Language = require('../../models/Language');
const UserAddress = require('../../models/UserAddress');
const Wallet = require('../../models/Wallet');
const DeliveryPrice = require('../../models/DeliveryPrice');
const DelhiveryService = require('../../services/DelhiveryService');
const CoreRepository = require('../CoreRepository');
const CartService = require('../../services/CartService');
const Settings = require('../../models/Settings');
const OrderHelper = require('../../helpers/OrderHelper');
const logger = require('../../utils/logger');

class CartRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async get(filter = {}) {
    const userId = filter.user_id || this.authUserId();
    if (!filter.user_cart_uuid && userId) {
      filter.user_id = userId;
    }

    const cart = await Cart.findOne({
      where: Cart.buildFilter(filter),
      include: this.with(),
    });

    if (!cart) return null;

    await CartService.calculateTotalPrice(cart);

    const updatedCart = await Cart.findOne({
      where: Cart.buildFilter(filter),
      include: this.with(),
    });

    const currency = await Currency.findByPk(filter.currency_id);
    if (currency && updatedCart.currency_id !== currency.id) {
      await updatedCart.update({ currency_id: currency.id, rate: currency.rate });
    }

    return updatedCart;
  }

  with = async () => {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return [
      {
        association: 'userCarts',
        include: [
          {
            association: 'cartDetails',
            include: [
              'shop',
              {
                association: 'shop.translation',
                where: {
                  [Op.or]: [{ locale: this.language }, { locale }],
                },
                required: false,
              },
              {
                association: 'cartDetailProducts',
                where: { parent_id: null },
                include: [
                  'galleries',
                  {
                    association: 'stock.discount',
                    where: {
                      start: { [Op.lte]: new Date() },
                      end: { [Op.gte]: new Date() },
                      active: true,
                    },
                    required: false,
                  },
                  {
                    association: 'stock.product.translation',
                    where: {
                      [Op.or]: [{ locale: this.language }, { locale }],
                    },
                    required: false,
                  },
                  'stock.stockExtras.value',
                  {
                    association: 'stock.stockExtras.group.translation',
                    where: {
                      [Op.or]: [{ locale: this.language }, { locale }],
                    },
                    required: false,
                  },
                  'stock.wholeSalePrices',
                ],
              },
            ],
          },
        ],
      },
    ];
  };

  async calculateByCartId(id, data) {
    try {
      const currency = await Currency.findByPk(data.currency_id);
      let cart = await Cart.findByPk(id, {
        include: await this.with(),
      });

      if (!cart) {
        return { status: false, code: 404 };
      }

      if (!cart.userCarts?.length) {
        return { status: false, code: 400, message: 'Cart is empty' };
      }

      if (currency) {
        await cart.update({ currency_id: currency.id, rate: currency.rate });
      }

      const rate = currency?.rate || cart.rate;
      let totalTax = 0,
        totalShopTax = 0,
        price = 0,
        totalDiscount = 0,
        deliveryFee = [],
        errors = [],
        couponPrice = [];

      const isWalletRequested = data.is_wallet_applied;
      if (isWalletRequested === 'false' || isWalletRequested === false) {
        await cart.update({ wallet_applied_amount: 0 });
      } else if (isWalletRequested === 'true' || cart.wallet_applied_amount > 0) {
        const wallet = await Wallet.findOne({ where: { user_id: cart.owner_id } });
        const walletBalance = wallet?.price || 0;
        await cart.update({ wallet_applied_amount: walletBalance });
      }

      for (const userCart of cart.userCarts || []) {
        for (const cartDetail of userCart.cartDetails || []) {
          let discount = 0;
          let totalWeight = 0;

          for (const product of cartDetail.cartDetailProducts || []) {
            if (!product.stock) await product.destroy();
            totalTax += product.stock?.rate_tax_price || 0;
            price += product.rate_price;
            discount += product.rate_discount;
            totalWeight += product.stock?.weight || 0;
          }

          const deliveryAddressId = data.delivery_address_id || cart.delivery_address_id;

          if (deliveryAddressId) {
            await cart.update({ delivery_address_id: deliveryAddressId });
            try {
              const origin = cartDetail.shop?.location?.zipcode || '110001';
              const destination = (await UserAddress.findByPk(deliveryAddressId))?.zipcode || '000000';
              const response = await DelhiveryService.calculateShippingCharges({
                origin,
                destination,
                weight: totalWeight || 1500,
                mode: 'S',
                shipment_type: 'RTO',
              });

              deliveryFee.push({
                shop_id: cartDetail.shop_id,
                price: (response?.[0]?.total_amount || 0) * rate,
                provider: 'delhivery',
              });
            } catch (err) {
              errors.push({ shop_id: cartDetail.shop_id, message: err.message });
            }
          }

          const totalPrice = cartDetail.cartDetailProducts.reduce((acc, p) => acc + p.price, 0);
          const shopTax = Math.max(((totalPrice - discount) / rate) / 100 * (cartDetail.shop?.tax || 0), 0) * rate;

          totalShopTax += shopTax;
          totalDiscount += discount;

          cartDetail.shop_tax = shopTax;
          cartDetail.discount = discount;
          cartDetail.total_price = totalPrice + shopTax;

          const coupon = couponPrice.find(cp => cp.shop_id === cartDetail.shop_id);
          if (!coupon || coupon.price <= 0) {
            const coupons = await OrderHelper.checkCoupon(data, cartDetail.shop_id, totalPrice - discount, rate, couponPrice, deliveryFee);
            couponPrice = coupons;
          }
        }
      }

      let serviceFee = parseFloat((await Settings.findOne({ where: { key: 'service_fee' } }))?.value || 0);
      serviceFee = serviceFee * rate;

      const deliveryFeeSum = deliveryFee.reduce((acc, d) => acc + d.price, 0);
      const couponPriceSum = couponPrice.reduce((acc, c) => acc + c.price, 0);
      const tips = parseFloat(data.tips || 0);

      let deliveryPrice = await DeliveryPrice.findOne({ where: { cart_id: cart.id } });
      if (!deliveryPrice) {
        deliveryPrice = await DeliveryPrice.create({
          cart_id: cart.id,
          price: deliveryFeeSum || 50,
          region_id: cart.region_id,
          country_id: cart.country_id,
          city_id: cart.city_id,
          area_id: cart.area_id,
        });
      } else {
        await deliveryPrice.update({ price: deliveryFeeSum || 50 });
      }

      const walletAmountApplied = cart.wallet_applied_amount || 0;
      const walletDiscount = Math.min(walletAmountApplied, price + deliveryFeeSum - couponPriceSum);
      const totalAfterWallet = Math.max(price + deliveryFeeSum - couponPriceSum - walletDiscount, 0);

      const result = {
        total_tax: totalTax,
        price,
        total_shop_tax: totalShopTax,
        total_price: totalAfterWallet,
        delivery_fee: deliveryFee,
        delivery_fee_sum: deliveryFeeSum,
        total_discount: totalDiscount,
        delivery_price_id: deliveryPrice.id,
        coupon: couponPrice,
        rate,
        service_fee: serviceFee,
        tips,
        wallet: walletDiscount,
        wallet_amount_applied: walletAmountApplied,
        ...(errors.length ? { errors } : {}),
      };

      return { status: true, code: 0, data: result };
    } catch (e) {
      logger.error('calculateByCartId error:', e);
      return {
        status: false,
        code: 500,
        message: 'An error occurred while calculating the cart.',
        error: e.message,
      };
    }
  }
}

module.exports = new CartRepository();
