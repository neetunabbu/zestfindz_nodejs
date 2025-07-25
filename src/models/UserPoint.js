'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPoint = sequelize.define('UserPoint', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, {
    tableName: 'user_points',
    timestamps: false,
  });

  UserPoint.associate = function(models) {
    UserPoint.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return UserPoint;
};
