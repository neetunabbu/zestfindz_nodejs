const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class LandingPage extends Model {
    static filter(query, filter) {
        return query.where(filter.type ? {
            type: this.TYPES[filter.type] || this.WELCOME
        } : {});
    }
}

// Constants
LandingPage.WELCOME = 'welcome';

LandingPage.TYPES = {
    [LandingPage.WELCOME]: LandingPage.WELCOME
};

LandingPage.init({
    id: {
        type: DataTypes.BIGINT,   // ✅ match with BIGSERIAL from PostgreSQL
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,    // ✅ better to explicitly use JSONB (Postgres native)
        allowNull: false
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
    modelName: 'LandingPage',
    tableName: 'landing_pages',
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = LandingPage;
