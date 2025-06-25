const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AreaTranslation extends Model {}

AreaTranslation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        area_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        locale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'AreaTranslation',
        tableName: 'area_translations',
        timestamps: false, // ✅ Laravel's $timestamps = false
    }
);

// ✅ Relationships
AreaTranslation.associate = (models) => {
    AreaTranslation.belongsTo(models.Area, { foreignKey: 'area_id', as: 'area' });
};

module.exports = AreaTranslation;
