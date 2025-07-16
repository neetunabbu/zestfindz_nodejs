// models/OrderStatusNote.js

module.exports = (sequelize, DataTypes) => {
  const OrderStatusNote = sequelize.define('OrderStatusNote', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.JSONB, // Use JSONB for PostgreSQL
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
  }, {
    tableName: 'order_status_notes',
    underscored: true,
    timestamps: false, // If you use Sequelize timestamps, set to true
  });

  OrderStatusNote.associate = (models) => {
    OrderStatusNote.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return OrderStatusNote;
};
