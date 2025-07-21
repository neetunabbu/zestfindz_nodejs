// src/repositories/ReviewRepository/ReviewRepository.js

const { Op, fn, col, literal } = require('sequelize');
const { Review } = require('../../models/Review');
const { User } = require('../../models/User');
const { Product } = require('../../models/Product');
const { Order } = require('../../models/Order');
const { OrderDetail } = require('../../models/OrderDetail');
const { Language } = require('../../models/Language');
const Utility = require('../../helpers/Utility');
const BaseRepository = require('../CoreRepository');

class ReviewRepository extends BaseRepository {
  getModelClass() {
    return Review;
  }

  async paginate(filter = {}, customWith = []) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    const withRelations = [];

    const includeUser = {
      model: User,
      attributes: ['id', 'uuid', 'firstname', 'lastname', 'email', 'img']
    };

    const baseRelations = [
      includeUser,
      { association: 'assignable' },
      { association: 'galleries' }
    ];

    const type = filter.type;
    const assign = filter.assign;

    if (customWith.length > 0) {
      customWith.forEach(r => withRelations.push(r));
    } else if (type === 'order') {
      withRelations.push(
        ...baseRelations,
        {
          association: 'reviewable',
          include: [
            {
              association: 'shop',
              attributes: ['id', 'uuid', 'type'],
              include: [
                {
                  association: 'translation',
                  where: { locale },
                  attributes: ['id', 'locale', 'title', 'shop_id']
                },
                { association: 'translations', attributes: ['id'] }
              ]
            }
          ]
        }
      );
    } else if (type === 'product') {
      withRelations.push(
        ...baseRelations,
        {
          association: 'reviewable',
          attributes: ['id', 'uuid', 'shop_id', 'img'],
          include: [
            { association: 'translations', attributes: ['id'] },
            {
              association: 'translation',
              where: locale ? { locale: { [Op.or]: [this.language, locale] } } : undefined,
              attributes: ['id', 'locale', 'title', 'description', 'product_id']
            }
          ]
        },
        {
          association: 'assignable',
          include: [
            {
              association: 'translation',
              where: locale ? { locale: { [Op.or]: [this.language, locale] } } : undefined
            }
          ]
        }
      );
    } else if (type === 'shop' || assign === 'assign') {
      withRelations.push(
        ...baseRelations,
        {
          association: 'assignable',
          include: [
            {
              association: 'translation',
              where: locale ? { locale: { [Op.or]: [this.language, locale] } } : undefined
            }
          ]
        }
      );
    } else {
      withRelations.push(...baseRelations);
    }

    let column = filter.column || 'id';

    if (!Review.rawAttributes[column]) {
      column = 'id';
    }

    const sort = filter.sort || 'desc';
    const perPage = parseInt(filter.perPage) || 10;

    const user = filter.authUser || null;

    const order = (column === 'user' && user?.id)
      ? [[literal(`FIELD(user_id, ${user.id})`), 'DESC']]
      : [[column, sort]];

    return await Review.scope('filter', filter).findAndCountAll({
      include: withRelations,
      order,
      limit: perPage,
      offset: ((parseInt(filter.page) || 1) - 1) * perPage
    });
  }

  async show(review) {
    return await Review.findByPk(review.id, {
      include: ['reviewable', 'assignable', 'galleries', 'user']
    });
  }

  async reviewsGroupByRating(id) {
    return await Utility.reviewsGroupRating({
      assignable_id: id,
      assignable_type: 'User' // Sequelize model class name or constant equivalent
    });
  }

  async addedReview(filter) {
    const userId = filter.user_id;
    const type = filter.type;
    const typeId = filter.type_id;

    if (!userId) {
      return {
        ordered: false,
        added_review: false
      };
    }

    let ordered = false;

    if (type === 'shop') {
      ordered = await Order.findOne({
        where: { user_id: userId, status: 'delivered' },
        include: [
          {
            association: 'orderDetails',
            where: { shop_id: typeId }
          }
        ]
      });
    } else if (type === 'product') {
      const product = await Product.findByPk(typeId, {
        include: ['stocks']
      });

      const stockIds = product?.stocks?.map(s => s.id) || [];

      ordered = await OrderDetail.findOne({
        where: { stock_id: { [Op.in]: stockIds } },
        include: [
          {
            association: 'order',
            where: { user_id: userId, status: 'delivered' }
          }
        ]
      });
    }

    const addedReview = await Review.scope('filter', filter).count() > 0;

    return {
      ordered: !!ordered,
      added_review: addedReview
    };
  }
}

module.exports = new ReviewRepository();

