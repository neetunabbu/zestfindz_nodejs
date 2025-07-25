// src/services/CartService/CartService.js

const { Op } = require('sequelize');
const { Cart } = require('../../models/Cart');
const { CartDetail } = require('../../models/CartDetail');
const { CartDetailProduct } = require('../../models/CartDetailProduct');
const { Currency } = require('../../models/Currency');
const { Bonus } = require('../../models/Bonus');
const { sequelize } = require('../../config/db');
const ResponseError = require('../../helpers/ResponseError');
const OrderHelper = require('../../helpers/OrderHelper');
const CartResource = require('../../resources/Cart/CartResource');

class CartService {

  async create(userId, data, lang) {
    const t = await sequelize.transaction();
    try {
      await CartDetail.destroy({ where: { user_id: userId }, transaction: t });

      let cart = await Cart.findOne({ where: { user_id: userId }, transaction: t });
      if (!cart) {
        cart = await Cart.create({ user_id: userId }, { transaction: t });
      }

      for (const item of data.products) {
        const cartDetail = await CartDetail.create({
          user_id: userId,
          shop_id: item.shop_id,
          cart_id: cart.id,
        }, { transaction: t });

        const products = item.products.map(p => ({
          ...p,
          cart_detail_id: cartDetail.id,
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await CartDetailProduct.bulkCreate(products, { transaction: t });
      }

      const result = await this.successReturn(userId, lang);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw new ResponseError(error.message);
    }
  }

  async deleteUserCart(userId) {
    const t = await sequelize.transaction();
    try {
      await CartDetailProduct.destroy({ where: { user_id: userId }, transaction: t });
      await CartDetail.destroy({ where: { user_id: userId }, transaction: t });
      await Cart.destroy({ where: { user_id: userId }, transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw new ResponseError(error.message);
    }
  }

  async successReturn(userId, lang) {
    const cart = await Cart.findOne({ where: { user_id: userId }, include: [/* include related models */] });
    return new CartResource(cart, lang);
  }

  async bonus(userId, bonusId, lang) {
    const bonus = await Bonus.findByPk(bonusId);
    if (!bonus || !bonus.is_active || new Date(bonus.expired_at) < new Date()) {
      throw new ResponseError('Invalid or expired bonus');
    }

    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new ResponseError('Cart not found');
    }

    cart.bonus_id = bonusId;
    await cart.save();

    return this.successReturn(userId, lang);
  }

  async checkBonus(userId, lang) {
    const cart = await Cart.findOne({ where: { user_id: userId }, include: [Bonus] });
    if (!cart || !cart.bonus || !cart.bonus.is_active || new Date(cart.bonus.expired_at) < new Date()) {
      cart.bonus_id = null;
      await cart.save();
    }

    return this.successReturn(userId, lang);
  }
}

module.exports = new CartService();
