// models/banner_translation.js
module.exports = (sequelize, DataTypes) => {
  const BannerTranslation = sequelize.define('BannerTranslation', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    banner_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    button_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    tableName: 'banner_translations',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['banner_id', 'locale']
      },
      {
        fields: ['locale']
      }
    ]
  });

  BannerTranslation.associate = (models) => {
    BannerTranslation.belongsTo(models.Banner, {
      foreignKey: 'banner_id',
      as: 'banner',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return BannerTranslation;
};
