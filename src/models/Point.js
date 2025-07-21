// models/Point.js

module.exports = (sequelize, DataTypes) => {
  const Point = sequelize.define('Point', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'fix',
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'points',
    timestamps: false, // Using manual timestamps
    underscored: true, // Matches snake_case columns
  });

  Point.associate = (models) => {
    Point.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });
  };

  return Point;
};
