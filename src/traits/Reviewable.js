// D:\zestfindz_nodejs\src\traits\Reviewable.js

const Review = require('../models/Review');
const User = require('../models/User');
const { Op, fn, col } = require('sequelize');
const auth = require('../utils/auth'); // your auth handler (mock or real)

const Reviewable = {
  async addReview(instance, collection, reqUser) {
    const userId = reqUser?.id;
    if (!userId) throw new Error('Unauthorized');

    const [review] = await Review.findOrCreate({
      where: {
        userId: userId,
        reviewableId: instance.id,
        reviewableType: instance.constructor.name
      },
      defaults: {
        rating: collection.rating,
        comment: collection.comment
      }
    });

    if (!review.isNewRecord) {
      review.rating = collection.rating;
      review.comment = collection.comment;
      await review.save();
    }

    await Reviewable.selfUpdate(instance, collection, review, reqUser);
  },

  async addAssignReview(instance, collection, assignable, reqUser) {
    const userId = reqUser?.id;
    if (!userId) throw new Error('Unauthorized');

    const [review] = await Review.findOrCreate({
      where: {
        userId,
        reviewableId: instance.id,
        reviewableType: instance.constructor.name,
        assignableId: assignable.id,
        assignableType: assignable.constructor.name
      },
      defaults: {
        rating: collection.rating,
        comment: collection.comment
      }
    });

    if (!review.isNewRecord) {
      review.rating = collection.rating;
      review.comment = collection.comment;
      await review.save();
    }

    if (assignable.id !== instance.id) {
      const result = await Review.findAll({
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('rating')), 'sum'],
          [fn('AVG', col('rating')), 'avg']
        ],
        where: {
          assignableId: assignable.id,
          assignableType: assignable.constructor.name
        },
        raw: true
      });

      const stats = result[0];

      await assignable.update({
        r_count: stats?.count || 0,
        r_sum: parseFloat(stats?.sum || 0).toFixed(1),
        r_avg: parseFloat(stats?.avg || 0).toFixed(1)
      });
    }

    await Reviewable.selfUpdate(instance, collection, review, reqUser);
  },

  async reviews(instance) {
    return Review.findAll({
      where: {
        reviewableId: instance.id,
        reviewableType: instance.constructor.name
      }
    });
  },

  async review(instance) {
    return Review.findOne({
      where: {
        reviewableId: instance.id,
        reviewableType: instance.constructor.name
      },
      order: [['id', 'DESC']]
    });
  },

  async selfUpdate(instance, collection, review, reqUser) {
    const userId = reqUser?.id;
    if (!userId) return;

    const [reviewStats, userStats] = await Promise.all([
      Review.findAll({
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('rating')), 'sum'],
          [fn('AVG', col('rating')), 'avg']
        ],
        where: {
          reviewableId: instance.id,
          reviewableType: instance.constructor.name
        },
        raw: true
      }),
      Review.findAll({
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('rating')), 'sum'],
          [fn('AVG', col('rating')), 'avg']
        ],
        where: {
          userId
        },
        raw: true
      })
    ]);

    const reviewStat = reviewStats[0];
    const userStat = userStats[0];

    await instance.update({
      r_count: reviewStat?.count || 0,
      r_sum: parseFloat(reviewStat?.sum || 0).toFixed(1),
      r_avg: parseFloat(reviewStat?.avg || 0).toFixed(1)
    });

    const user = await User.findByPk(userId);
    if (user) {
      await user.update({
        r_count: userStat?.count || 0,
        r_sum: parseFloat(userStat?.sum || 0).toFixed(1),
        r_avg: parseFloat(userStat?.avg || 0).toFixed(1)
      });
    }

    if (collection?.images?.length > 0) {
      await review.galleries?.destroy({ where: { reviewId: review.id } });

      await review.update({ img: collection.images[0] });

      if (typeof review.uploads === 'function') {
        await review.uploads(collection.images);
      }
    }
  }
};

module.exports = Reviewable;
