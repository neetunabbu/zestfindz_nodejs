const { DataTypes } = require('sequelize');

// Mixin to define the Regions relationship
const Regions = (sequelize) => {
  return {
    // Define the belongsTo relationship with Region model
    defineRelationships: (Model, RegionModel) => {
      Model.belongsTo(RegionModel, {
        foreignKey: {
          name: 'region_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: true
        },
        as: 'region'
      });
    }
  };
};

module.exports = Regions;