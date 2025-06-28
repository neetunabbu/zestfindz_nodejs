const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class ReferedUser extends Model {}

ReferedUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ref_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refered_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // ✅ corrected
    },
    person_name: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ corrected
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending',
      validate: {
        isIn: [['completed', 'pending']], // optional enforcement of enum-like check
      },
    },
  },
  {
    sequelize,
    modelName: 'ReferedUser',
    tableName: 'refered_users',
    timestamps: true,
    freezeTableName: true,
  }
);

// Relationships
ReferedUser.belongsTo(User, { as: 'referredBy', foreignKey: 'ref_by_id' });
ReferedUser.belongsTo(User, { as: 'referredPerson', foreignKey: 'refered_person_id' });

module.exports = ReferedUser;
