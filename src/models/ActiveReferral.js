const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ActiveReferral extends Model {
  static init() {
    super.init(
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
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but we ensure all fields except 'id' are mass-assignable
        // No additional hooks or scopes, as per original model
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.Referral, { foreignKey: 'referral_id', as: 'referral' });
    this.belongsTo(models.User, { foreignKey: 'from_id', as: 'from' });
    this.belongsTo(models.User, { foreignKey: 'to_id', as: 'to' });
  }
}

// Initialize the model
ActiveReferral.init();

module.exports = ActiveReferral;