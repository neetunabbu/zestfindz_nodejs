const { DataTypes } = require('sequelize');

// Mixin to define the City relationship
const Cities = (sequelize) => {
  return {
    // Define the belongsTo relationship with City model
    defineRelationships: (Model, CityModel) => {
      Model.belongsTo(CityModel, {
        foreignKey: {
          name: 'city_id',
          type: DataTypes.BIGINT, // Matches assumed City model's id type
          allowNull: true
        },
        as: 'city'
      });
    }
  };
};

module.exports = Cities;