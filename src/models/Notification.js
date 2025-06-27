const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Notification extends Model {
    static PUSH = 'push';

    static TYPES = {
        [Notification.PUSH]: Notification.PUSH,
    };
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        payload: {
            type: DataTypes.JSONB,  // Should match JSONB in PG
            allowNull: true,        // match DB default NULL
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,       // match DB default NULL
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,       // match DB default NULL
        },
    },
    {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
        underscored: true,
        timestamps: false, // Because timestamps are manually handled (not sequelize auto fields)
    }
);

// If you're using this — create notification_user table too
Notification.associate = (models) => {
    Notification.belongsToMany(models.User, {
        through: 'notification_user',
        as: 'users',
        foreignKey: 'notification_id',
        otherKey: 'user_id',
    });
};

module.exports = Notification;
