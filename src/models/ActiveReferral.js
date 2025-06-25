const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ActiveReferral extends Model {}

ActiveReferral.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        referral_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'ActiveReferral',
        tableName: 'active_referrals',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// Model Associations
ActiveReferral.associate = (models) => {
    ActiveReferral.belongsTo(models.Referral, { foreignKey: 'referral_id', as: 'referral' });
    ActiveReferral.belongsTo(models.User, { foreignKey: 'from_id', as: 'from' });
    ActiveReferral.belongsTo(models.User, { foreignKey: 'to_id', as: 'to' });
};

module.exports = ActiveReferral;
