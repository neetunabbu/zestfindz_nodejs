const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CountryTranslation extends Model {}

CountryTranslation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    locale: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'CountryTranslation',
    tableName: 'country_translations',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    defaultScope: {
        attributes: { exclude: [] } // No guarded fields except id, which is handled by primaryKey
    }
});

// Define relationship
CountryTranslation.belongsTo(require('./Country'), {
    foreignKey: 'country_id',
    as: 'country'
});

module.exports = CountryTranslation;