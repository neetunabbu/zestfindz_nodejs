// models/deliveryman_setting.js

module.exports = (sequelize, DataTypes) => {
  const DeliverymanSetting = sequelize.define('DeliverymanSetting', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    type_of_technique: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'deliveryman_settings',
    timestamps: false, // manually managing timestamps
    underscored: true,
  });

  DeliverymanSetting.associate = (models) => {
    DeliverymanSetting.belongsTo(models.User, { foreignKey: 'user_id' });
    DeliverymanSetting.belongsTo(models.Region, { foreignKey: 'region_id' });
    DeliverymanSetting.belongsTo(models.Country, { foreignKey: 'country_id' });
    DeliverymanSetting.belongsTo(models.City, { foreignKey: 'city_id' });
    DeliverymanSetting.belongsTo(models.Area, { foreignKey: 'area_id' });
  };

  return DeliverymanSetting;
};
