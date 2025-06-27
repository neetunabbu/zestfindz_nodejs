const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Gallery extends Model {}

Gallery.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loadable_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loadable_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preview: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isset: {  // ✅ present in model but not in SQL table
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Gallery',
    tableName: 'galleries',
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = Gallery;
