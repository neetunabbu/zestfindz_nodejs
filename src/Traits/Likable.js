const { DataTypes } = require('sequelize');

// Mixin to define the Likable polymorphic relationship and like functionality
const LikableMixin = (sequelize) => {
  return {
    // Define the morphMany relationship with Like model
    defineRelationships: (Model, LikeModel) => {
      Model.hasMany(LikeModel, {
        foreignKey: {
          name: 'likable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          likable_type: Model.name
        },
        as: 'likes'
      });
    },

    // Toggle like functionality
    liked: async (instance, userId) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const LikeModel = sequelize.models.Like;
      const like = await LikeModel.findOne({
        where: {
          user_id: userId,
          likable_id: instance.id,
          likable_type: instance.constructor.name
        }
      });

      if (!like) {
        await LikeModel.create({
          user_id: userId,
          likable_id: instance.id,
          likable_type: instance.constructor.name
        });
        return;
      }

      await like.destroy();
    }
  };
};

module.exports = LikableMixin;