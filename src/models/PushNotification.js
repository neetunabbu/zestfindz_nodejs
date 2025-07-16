const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PushNotification extends Model {
    static associate(models) {
      // Association with User model
      PushNotification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  PushNotification.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      model_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isJson(value) {
            if (value && typeof value !== 'object') {
              throw new Error('Data must be a valid JSON object');
            }
          }
        }
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'PushNotification',
      tableName: 'push_notifications',
      timestamps: false, // disable Sequelize auto timestamps
      underscored: true // for snake_case fields
    }
  );

  return PushNotification;
};
