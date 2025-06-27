const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Faq extends Model {
    static associate(models) {
        // Relationships
        this.hasMany(models.FaqTranslation, { foreignKey: 'faq_id', as: 'translations' });
        this.hasOne(models.FaqTranslation, { foreignKey: 'faq_id', as: 'translation' });
        this.belongsTo(models.FaqCategory, { foreignKey: 'category_id', as: 'category' }); // ✅ for category_id
    }
}

Faq.init({
    id: {
        type: DataTypes.BIGINT,          // BIGSERIAL → BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    uuid: {
        type: DataTypes.UUID,            // Use native UUID
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true               // Default is TRUE as per SQL
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Faq',
    tableName: 'faqs',
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = Faq;
