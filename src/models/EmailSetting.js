const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const NodeCache = require('node-cache');

const cache = new NodeCache();

class EmailSetting extends Model {
    static async list() {
        const cacheKey = 'email-settings-list';
        const TTL = 8640000000; // 100000 days in seconds

        let cachedData = cache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const data = await this.findAll({
            order: [['id', 'DESC']]
        });

        cache.set(cacheKey, data, TTL);
        return data;
    }
}

EmailSetting.init({
    id: {
        type: DataTypes.BIGINT, // Changed to match BIGSERIAL
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    smtp_auth: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Fixed to match DB
    },
    smtp_debug: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    host: {
        type: DataTypes.STRING(92),
        allowNull: false
    },
    port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 465
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true // Fixed
    },
    from_to: {
        type: DataTypes.STRING,
        allowNull: true // Fixed
    },
    from_site: {
        type: DataTypes.STRING,
        allowNull: true // Fixed
    },
    ssl: {
        type: DataTypes.JSONB, // Use JSONB in Postgres
        allowNull: true // Fixed
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    modelName: 'EmailSetting',
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = EmailSetting;
