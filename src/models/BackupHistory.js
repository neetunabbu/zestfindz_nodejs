const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BackupHistory extends Model {}

BackupHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN, // ✅ Correct casting
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'BackupHistory',
        tableName: 'backup_histories',
        timestamps: false, // ✅ Laravel's $timestamps = false
    }
);

// ✅ Model Associations
BackupHistory.associate = (models) => {
    BackupHistory.belongsTo(models.User, { foreignKey: 'created_by', as: 'user' });
};

module.exports = BackupHistory;
