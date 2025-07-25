const { ParcelOrder, User, Review, sequelize } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const auth = require('../../middlewares/mockAuth'); // for current user
const { Op } = require('sequelize');

class ParcelOrderReviewService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Add review for the deliveryman by the customer
   * @param {number} id
   * @param {object} collection
   * @returns {Promise<object>}
   */
  async addDeliverymanReview(id, collection) {
    try {
      const model = await ParcelOrder.findByPk(id, {
        include: ['deliveryman', 'review', 'reviews']
      });

      if (!model || !model.deliveryman?.id) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
          message: `errors.${ResponseError.ORDER_OR_DELIVERYMAN_IS_EMPTY}`
        };
      }

      await this._addAssignReview(model, collection, model.deliveryman);

      const updatedModel = await ParcelOrder.findByPk(model.id, {
        include: [{ association: 'reviews', include: ['assignable'] }]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedModel
      };

    } catch (error) {
      console.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message
      };
    }
  }

  /**
   * Add review by deliveryman for the user
   * @param {number} id
   * @param {object} collection
   * @param {number} currentUserId
   * @returns {Promise<object>}
   */
  async addReviewByDeliveryman(id, collection, currentUserId) {
    try {
      const model = await ParcelOrder.findByPk(id, {
        include: ['deliveryman', 'review', 'reviews', 'user']
      });

      if (!model || model.deliveryman?.id !== currentUserId || !model.user) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `errors.${ResponseError.ORDER_NOT_FOUND}`
        };
      }

      await this._addAssignReview(model, collection, model.user);

      const updatedModel = await ParcelOrder.findByPk(model.id, {
        include: [{ association: 'reviews', include: ['assignable'] }]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedModel
      };

    } catch (error) {
      console.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message
      };
    }
  }

  /**
   * Common review assignment logic
   * @private
   */
  async _addAssignReview(parcelOrder, collection, assignTo) {
    await sequelize.transaction(async (t) => {
      await Review.create({
        rating: collection.rating,
        comment: collection.comment,
        reviewableType: 'ParcelOrder',
        reviewableId: parcelOrder.id,
        assignableType: assignTo.constructor.name,
        assignableId: assignTo.id,
      }, { transaction: t });
    });
  }
}

module.exports = ParcelOrderReviewService;
