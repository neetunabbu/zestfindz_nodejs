const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Area extends Model {}

Area.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Area',
        tableName: 'areas',
        timestamps: false, // Match Laravel's $timestamps = false
    }
);

// ✅ Relationships
Area.associate = (models) => {
    Area.hasMany(models.AreaTranslation, { foreignKey: 'area_id', as: 'translations' });
    Area.hasOne(models.AreaTranslation, { foreignKey: 'area_id', as: 'translation' });
    Area.hasOne(models.DeliveryPrice, { foreignKey: 'area_id', as: 'deliveryPrice' });
    Area.hasMany(models.DeliveryPrice, { foreignKey: 'area_id', as: 'deliveryPrices' });
};

// ✅ Scope: Active
Area.scopeActive = () => {
    return {
        where: { active: true }
    };
};

// 🚩 Important: Laravel's `when` and `request` methods don't directly exist in Sequelize. 
// You will need to write separate query builder functions in your service file instead of the static filter function as you tried.

module.exports = Area;
