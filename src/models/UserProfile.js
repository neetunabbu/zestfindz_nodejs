// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  UserProfile.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      isPrimaryProfile: DataTypes.BOOLEAN,
      address: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'UserProfile',
      tableName: 'user_profiles',
      underscored: true,
    }
  );

  return UserProfile;
};
