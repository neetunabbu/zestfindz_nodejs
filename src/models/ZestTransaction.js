const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class ZestTransaction extends Model {}

ZestTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['added', 'refunded', 'referal', 'paid']],
      },
    },
    ref_name_or_order_id_or_transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.STRING,  // should remain string as per your DB
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),  // matches PostgreSQL NUMERIC(10,2)
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ZestTransaction',
    tableName: 'zest_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define the BelongsTo relationship
ZestTransaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ZestTransaction;
