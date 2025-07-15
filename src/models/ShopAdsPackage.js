

module.exports = (sequelize, DataTypes) => {
  const ShopAdsPackage = sequelize.define('ShopAdsPackage', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'new'
    },
    ads_package_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    position_page: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
      comment: 'На какой странице будет выходить'
    }
  }, {
    tableName: 'shop_ads_packages',
    timestamps: false,
    underscored: true
  });


  ShopAdsPackage.associate = (models) => {
    ShopAdsPackage.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    ShopAdsPackage.belongsTo(models.AdsPackage, {
      foreignKey: 'ads_package_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };


  return ShopAdsPackage;
};
