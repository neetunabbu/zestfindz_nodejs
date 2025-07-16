// models/Notification.js

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('push'),
      allowNull: false,
      unique: true,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isJson(value) {
          if (value !== null && typeof value !== 'object') {
            throw new Error('Payload must be a valid JSON object');
          }
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'notifications',
    timestamps: false,
    underscored: true,
  });

  return Notification;
};
