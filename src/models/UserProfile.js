const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class UserProfile extends Model {}

UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // DB has NOT NULL
      references: {
        model: User,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // DB has NOT NULL
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false, // DB has NOT NULL
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'phoneNumber',
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'https://i.pravatar.cc/150?img=5',
      field: 'avatarUrl',
    },
    isPrimaryProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'isPrimaryProfile',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Enable soft deletes via deleted_at
    deletedAt: 'deleted_at',
  }
);

// Define relationship
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = UserProfile;
