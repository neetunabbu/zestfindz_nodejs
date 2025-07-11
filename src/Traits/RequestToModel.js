const { DataTypes } = require('sequelize');

// Mixin to define the RequestToModel polymorphic relationships
const RequestToModel = (sequelize) => {
  return {
    // Define the morphMany and morphOne relationships with RequestModel
    defineRelationships: (Model, RequestModel) => {
      // MorphMany: models
      Model.hasMany(RequestModel, {
        foreignKey: {
          name: 'model_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          model_type: Model.name
        },
        as: 'models'
      });

      // MorphOne: model
      Model.hasOne(RequestModel, {
        foreignKey: {
          name: 'model_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          model_type: Model.name
        },
        as: 'model'
      });
    }
  };
};

module.exports = RequestToModel;