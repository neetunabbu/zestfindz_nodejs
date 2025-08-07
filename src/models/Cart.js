// models/Cart.js

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id : {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    delivery_address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    currency_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1,
    },
   group_type: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'group',
  },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    wallet_applied_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    tableName: 'carts',
    timestamps: false,
    underscored: true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Cart.belongsTo(models.Currency, {
      foreignKey: 'currency_id',
      onDelete: 'SET NULL',
    });

    Cart.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Cart.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Cart.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Cart.belongsTo(models.Area, {
      foreignKey: 'area_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Cart.hasMany(models.UserCart, {
      foreignKey: 'cart_id',
    });
  };

  return Cart;
};
