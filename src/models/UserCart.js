// models/UserCart.js

module.exports = (sequelize, DataTypes) => {
  const UserCart = sequelize.define('UserCart', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: 'user_carts',
    timestamps: false,
    underscored: true,
  });

  UserCart.associate = (models) => {
    UserCart.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    UserCart.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return UserCart;
};

