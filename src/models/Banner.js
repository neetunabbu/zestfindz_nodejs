module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define('Banner', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'banner',
    },
    img: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    clickable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    input: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'banners',
    timestamps: false, // Laravel uses timestamps but we manually define them
    underscored: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['shop_id'] }
    ]
  });

  Banner.associate = (models) => {
    Banner.hasMany(models.BannerTranslation, {
      foreignKey: 'banner_id',
      as: 'translations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Banner.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Banner;
};
