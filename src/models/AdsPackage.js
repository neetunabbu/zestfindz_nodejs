// models/ads_package.js

module.exports = (sequelize, DataTypes) => {
  const AdsPackage = sequelize.define('AdsPackage', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Активный'
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'main',
      comment: 'Где будет выходить'
    },
    time_type: {
      type: DataTypes.STRING,
      defaultValue: 'day',
      comment: 'Тип времени рекламы: минут,час,день,недель,месяц,год'
    },
    time: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: 'Время'
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    product_limit: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    position_page: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      comment: 'На какой странице будет выходить'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ads_packages',
    timestamps: true,
    underscored: true // created_at and updated_at naming
  });


  AdsPackage.associate = (models) => {
    AdsPackage.hasMany(models.ShopAdsPackage, {
      foreignKey: 'ads_package_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };


  return AdsPackage;
};
