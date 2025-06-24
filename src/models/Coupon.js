const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Coupon extends Model {
    static async checkCoupon(coupon, shopId) {
        return this.findOne({
            where: {
                name: coupon,
                shop_id: shopId,
                qty: { [Op.gt]: 0 },
                expired_at: { [Op.gt]: new Date() }
            }
        });
    }

    static async filter(filter) {
        return this.scope({
            where: {
                ...(filter.type && { type: filter.type }),
                ...(filter.for && { for: filter.for }),
                ...(filter.price && { price: filter.price }),
                ...(filter.qty && { qty: filter.qty }),
                ...(filter.shop_id && { shop_id: filter.shop_id }),
                ...(filter.expired_from && {
                    expired_at: {
                        [Op.and]: [
                            { [Op.gte]: new Date(filter.expired_from) },
                            { [Op.lte]: filter.expired_to ? new Date(filter.expired_to) : new Date() }
                        ]
                    }
                })
            }
        }).findAll();
    }
}

Coupon.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'fix',
        validate: {
            isIn: [['fix', 'percent']]
        }
    },
    for: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'total_price'
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    expired_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING(255),
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
}, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    defaultScope: {
        attributes: { exclude: [] } // No guarded fields except id, handled by primaryKey
    }
});

// Define relationships
Coupon.hasMany(require('./CouponTranslation'), {
    foreignKey: 'coupon_id',
    as: 'translations'
});

Coupon.hasOne(require('./CouponTranslation'), {
    foreignKey: 'coupon_id',
    as: 'translation'
});

Coupon.belongsTo(require('./Shop'), {
    foreignKey: 'shop_id',
    as: 'shop'
});

Coupon.hasMany(require('./OrderCoupon'), {
    foreignKey: 'name',
    sourceKey: 'name',
    as: 'orderCoupons'
});

module.exports = Coupon;