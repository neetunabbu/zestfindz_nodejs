const { Op } = require('sequelize');
const User = require('../../models/User');
const Role = require('../../models/Role');
const Wallet = require('../../models/Wallet');
const Shop = require('../../models/Shop');
const Point = require('../../models/Point');
const Notification = require('../../models/Notification');
const Referral = require('../../models/Referral');
const Settings = require('../../models/Settings');
const Transaction = require('../../models/Transaction');
const Order = require('../../models/Order');
const Language = require('../../models/Language');

const CoreRepository = require('../CoreRepository');

class UserRepository extends CoreRepository {
  constructor() {
    super(User);
  }

  async userById(id, language = 'en') {
    const user = await this.model.findByPk(id, {
      include: [
        'roles', 'wallet', 'shop', 'point', 'emailSubscription', 'notifications', 'invite', 'currency'
      ]
    });

    if (!user || !user.wallet) return user;

    const referralActive = await Settings.findOne({ where: { key: 'referral_active' } });
    if (parseInt(referralActive?.value) !== 1) return user;

    const referral = await Referral.findOne({
      where: { expired_at: { [Op.gte]: new Date() } },
      include: ['translation', 'translations', 'galleries']
    });

    if (referral) {
      const rate = user.wallet.currency?.rate || 1;
      const histories = user.wallet.histories || [];

      const filterHistories = (type) => histories.filter(h => h.type === type);

      const sum = arr => arr.reduce((a, b) => a + parseFloat(b.price || 0), 0);

      user.setDataValue('referral_from_topup_price', sum(filterHistories('referral_from_topup')) * rate);
      user.setDataValue('referral_from_withdraw_price', sum(filterHistories('referral_from_withdraw')) * rate);
      user.setDataValue('referral_to_topup_price', sum(filterHistories('referral_to_topup')) * rate);
      user.setDataValue('referral_to_withdraw_price', sum(filterHistories('referral_to_withdraw')) * rate);
    }

    return user;
  }

  async chatShowById(id) {
    return User.findByPk(id, {
      attributes: ['id', 'firstname', 'lastname', 'img', 'active']
    });
  }

  async chatUsersGet(filter = {}) {
    return User.findAndCountAll({
      attributes: ['id', 'firstname', 'lastname', 'img', 'active'],
      where: filter.ids ? { id: { [Op.in]: filter.ids } } : {},
      limit: filter.perPage || 10
    });
  }

  async adminInfo() {
    return User.findOne({
      include: {
        model: Role,
        where: { name: 'admin' }
      },
      attributes: ['id', 'firstname', 'lastname', 'img']
    });
  }

  async userByUUID(uuid, language = 'en') {
    return User.findOne({
      where: { uuid },
      include: [
        {
          association: 'shop',
          include: {
            association: 'translation',
            where: {
              locale: { [Op.or]: [language, 'en'] }
            },
            required: false
          }
        },
        'wallet',
        'point',
        'deliveryManSetting',
        'roles',
        'currency',
        {
          association: 'invitations',
          include: [
            {
              association: 'shop',
              attributes: ['id'],
              include: {
                association: 'translation',
                where: {
                  locale: { [Op.or]: [language, 'en'] }
                },
                attributes: ['id', 'shop_id', 'locale', 'title'],
                required: false
              }
            }
          ]
        }
      ]
    });
  }

  async usersPaginate(filter = {}) {
    return this.model.findAndCountAll({
      where: this.buildFilter(filter),
      include: [
        'shop',
        'wallet',
        'deliveryManSetting',
        {
          association: 'roles',
          where: filter.role ? { name: filter.role } : undefined,
          required: false
        }
      ],
      limit: filter.perPage || 10
    });
  }

  async usersSearch(filter = {}) {
    return this.model.findAndCountAll({
      where: this.buildFilter(filter),
      include: [
        {
          association: 'roles',
          where: filter.roles ? { name: { [Op.in]: Array.isArray(filter.roles) ? filter.roles : [filter.roles] } } : undefined,
          required: false
        }
      ],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
      limit: filter.perPage || 10
    });
  }

  async usersNotifications() {
    return Notification.findAll();
  }

  async deliveryMans(filter = {}) {
    filter.role = 'deliveryman';
    if (filter['empty-setting']) {
      filter.online = false;
    }

    return this.model.findAndCountAll({
      where: this.buildFilter(filter),
      include: [
        'roles',
        'assignReviews',
        'deliveryManSetting',
        {
          association: 'deliveryManOrders',
          attributes: ['id', 'total_price', 'status', 'deliveryman_id', 'location', 'address', 'delivery_fee', 'rate', 'delivery_date', 'user_id', 'username', 'current'],
          where: filter.statuses ? { status: { [Op.in]: filter.statuses } } : undefined,
          include: {
            association: 'user',
            attributes: ['id', 'img', 'firstname', 'lastname']
          }
        },
        'wallet',
        'invitations'
      ],
      limit: filter.perPage || 10
    });
  }

  async shopUsersPaginate(filter = {}) {
    return this.model.findAndCountAll({
      where: this.buildFilter(filter),
      include: ['roles', 'invitations'],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
      limit: filter.perPage || 10
    });
  }

  async searchSending(filter = {}, currentUserId) {
    return this.model.findAndCountAll({
      where: {
        ...this.buildFilter(filter),
        id: { [Op.ne]: currentUserId }
      },
      include: ['wallet'],
      attributes: ['id', 'uuid', 'firstname', 'lastname', 'img'],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
      limit: filter.perPage || 10
    });
  }

  async notificationStatistic(userId) {
    const notifications = await Notification.findAll({
      where: {
        read_at: null,
        user_id: userId
      }
    });

    const transactions = await Transaction.count({
      where: {
        status: 'progress',
        user_id: userId
      }
    });

    return {
      notification: notifications.length,
      new_order: notifications.filter(n => n.type === 'new_order').length,
      new_user_by_referral: notifications.filter(n => n.type === 'new_user_by_referral').length,
      status_changed: notifications.filter(n => n.type === 'status_changed').length,
      news_publish: notifications.filter(n => n.type === 'news_publish').length,
      transaction: transactions
    };
  }
}

module.exports = new UserRepository();
