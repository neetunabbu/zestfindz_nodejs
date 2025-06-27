const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class FaqTranslation extends Model {}

FaqTranslation.init({
    id: {
        type: DataTypes.BIGINT, // Match BIGSERIAL from SQL
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    faq_id: {
        type: DataTypes.BIGINT, // match BIGINT
        allowNull: false
    },
    locale: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    question: {
        type: DataTypes.TEXT,  // corrected from STRING to TEXT
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,  // corrected from STRING to TEXT
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'FaqTranslation',
    tableName: 'faq_translations',
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = FaqTranslation;
