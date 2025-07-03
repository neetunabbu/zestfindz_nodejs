const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class UserRecentSearch extends Model {}

UserRecentSearch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,   // corrected to NOT NULL
    },
    search_item: {
      type: DataTypes.STRING,
      allowNull: false,   // corrected to NOT NULL
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserRecentSearch',
    tableName: 'user_recent_searches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  }
);

// Relationships
UserRecentSearch.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserRecentSearch;
