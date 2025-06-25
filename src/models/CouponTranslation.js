const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CouponTranslation extends Model {}

CouponTranslation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    locale: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'CouponTranslation',
    tableName: 'coupon_translations',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    defaultScope: {
        attributes: { exclude: [] } // No guarded fields except id, handled by primaryKey
    }
});

// Define relationship
CouponTranslation.belongsTo(require('./Coupon'), {
    foreignKey: 'coupon_id',
    as: 'coupon'
});

module.exports = CouponTranslation;