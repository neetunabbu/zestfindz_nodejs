// models/Translation.js
module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define(
    'Translation',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      tableName: 'translations',
      timestamps: true,
      underscored: true,
    }
  );

  Translation.associate = (models) => {
    Translation.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return Translation;
};
