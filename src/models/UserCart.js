const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class UserCart extends Model {}

UserCart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  uuid: {
    type: DataTypes.STRING, // or DataTypes.UUID
    allowNull: true
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
  sequelize,
  modelName: 'UserCart',
  tableName: 'user_carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Relationships
UserCart.associate = (models) => {
  UserCart.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  UserCart.belongsTo(models.Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
  });

  UserCart.hasMany(models.CartDetail, {
    foreignKey: 'user_cart_id',
    as: 'cartDetails'
  });

  UserCart.hasOne(models.CartDetail, {
    foreignKey: 'user_cart_id',
    as: 'cartDetail'
  });
};

module.exports = UserCart;
