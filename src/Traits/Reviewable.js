const { DataTypes, Sequelize } = require('sequelize');
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

// Mixin for reviewable functionality
const Reviewable = (sequelize) => {
  return {
    // Define the morphMany and morphOne relationships with Review model
    defineRelationships: (Model, ReviewModel) => {
      // MorphMany: reviews
      Model.hasMany(ReviewModel, {
        foreignKey: {
          name: 'reviewable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          reviewable_type: Model.name
        },
        as: 'reviews'
      });

      // MorphOne: review
      Model.hasOne(ReviewModel, {
        foreignKey: {
          name: 'reviewable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          reviewable_type: Model.name
        },
        as: 'review'
      });
    },

    // Add a review
    async addReview(instance, collection, userId) {
      LoggableMixin.error(new Error(`[Reviewable] addReview called: model_id=${instance.id}, user_id=${userId}`));

      const ReviewModel = sequelize.models.Review;

      try {
        const review = await ReviewModel.upsert(
          {
            user_id: userId,
            reviewable_id: instance.id,
            reviewable_type: instance.constructor.name,
            rating: dataGet(collection, 'rating'),
            comment: dataGet(collection, 'comment')
          },
          {
            returning: true,
            conflictFields: ['user_id', 'reviewable_id', 'reviewable_type']
          }
        );

        await this.selfUpdate(instance, collection, review[0]);
      } catch (error) {
        LoggableMixin.error(new Error(`[Reviewable] Error in addReview: ${error.message}`));
        throw error;
      }
    },

    // Add an assigned review
    async addAssignReview(instance, collection, assignable, userId) {
      LoggableMixin.error(new Error(`[Reviewable] addAssignReview called: model_id=${instance.id}, assignable_id=${assignable.id}, user_id=${userId}`));

      const ReviewModel = sequelize.models.Review;

      try {
        const review = await ReviewModel.upsert(
          {
            user_id: userId,
            reviewable_id: instance.id,
            reviewable_type: instance.constructor.name,
            assignable_id: assignable.id,
            assignable_type: assignable.constructor.name,
            rating: dataGet(collection, 'rating'),
            comment: dataGet(collection, 'comment')
          },
          {
            returning: true,
            conflictFields: ['user_id', 'reviewable_id', 'reviewable_type', 'assignable_id', 'assignable_type']
          }
        );

        if (assignable.id !== instance.id) {
          const assignableReviews = await ReviewModel.findOne({
            attributes: [
              [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
              [Sequelize.fn('SUM', Sequelize.col('rating')), 'sum'],
              [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']
            ],
            where: {
              assignable_id: assignable.id,
              assignable_type: assignable.constructor.name
            }
          });

          await assignable.update({
            r_count: assignableReviews.get('count') || 0,
            r_sum: Math.round((assignableReviews.get('sum') || 0) * 10) / 10,
            r_avg: Math.round((assignableReviews.get('avg') || 0) * 10) / 10
          });
        }

        await this.selfUpdate(instance, collection, review[0]);
      } catch (error) {
        LoggableMixin.error(new Error(`[Reviewable] Error in addAssignReview: ${error.message}`));
        throw error;
      }
    },

    // Update review statistics and handle images
    async selfUpdate(instance, collection, review) {
      LoggableMixin.error(new Error(`[Reviewable] selfUpdate called: model_id=${instance.id}, review_id=${review.id}`));

      const ReviewModel = sequelize.models.Review;
      const UserModel = sequelize.models.User;
      const GalleryModel = sequelize.models.Gallery;

      try {
        // Update reviewable model stats
        const reviews = await ReviewModel.findOne({
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
            [Sequelize.fn('SUM', Sequelize.col('rating')), 'sum'],
            [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']
          ],
          where: {
            reviewable_id: instance.id,
            reviewable_type: instance.constructor.name
          }
        });

        await instance.update({
          r_count: reviews.get('count') || 0,
          r_sum: Math.round((reviews.get('sum') || 0) * 10) / 10,
          r_avg: Math.round((reviews.get('avg') || 0) * 10) / 10
        });

        // Update user stats
        const userReviews = await ReviewModel.findOne({
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
            [Sequelize.fn('SUM', Sequelize.col('rating')), 'sum'],
            [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']
          ],
          where: { user_id: review.user_id }
        });

        const user = await UserModel.findByPk(review.user_id);
        if (user) {
          await user.update({
            r_count: userReviews.get('count') || 0,
            r_sum: Math.round((userReviews.get('sum') || 0) * 10) / 10,
            r_avg: Math.round((userReviews.get('avg') || 0) * 10) / 10
          });
        }

        // Handle images (using LoadableMixin logic)
        const images = dataGet(collection, 'images', []);
        if (images.length > 0) {
          // Delete existing galleries
          await GalleryModel.destroy({
            where: {
              loadable_id: review.id,
              loadable_type: ReviewModel.name
            }
          });

          // Update review with first image
          await review.update({
            img: images[0]
          });

          // Upload images to galleries
          for (const image of images) {
            await GalleryModel.create({
              path: image,
              loadable_id: review.id,
              loadable_type: ReviewModel.name
            });
          }
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[Reviewable] Error in selfUpdate: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = Reviewable;