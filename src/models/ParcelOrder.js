const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ParcelOrder = sequelize.define('ParcelOrder', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      comment: 'Сумма с учётом всех налогов и скидок'
    },
    currency_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rate: {
      type: DataTypes.DOUBLE(8, 2),
      defaultValue: 1.00
    },
    note: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    qr_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    instruction: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax: {
      type: DataTypes.DOUBLE,
      defaultValue: 1
    },
    status: {
      type: DataTypes.STRING(255),
      defaultValue: 'new'
    },
    address_from: {
      type: DataTypes.JSON,
      allowNull: true
    },
    phone_from: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username_from: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address_to: {
      type: DataTypes.JSON,
      allowNull: true
    },
    phone_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delivery_fee: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    km: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    deliveryman_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'parcel_orders',
    underscored: true,
    timestamps: false
  });

  ParcelOrder.associate = models => {
    ParcelOrder.belongsTo(models.Currency, {
      foreignKey: 'currency_id',
      onDelete: 'SET NULL'
    });

    ParcelOrder.belongsTo(models.User, {
      foreignKey: 'deliveryman_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    ParcelOrder.belongsTo(models.ParcelOrderSetting, {
      foreignKey: 'type_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ParcelOrder;
};
