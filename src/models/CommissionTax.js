const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CommissionTax extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        seller_commission: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        seller_tax: {
          type: DataTypes.FLOAT,
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
        modelName: 'CommissionTax',
        tableName: 'commission_taxes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's fillable behavior: 'seller_commission', 'seller_tax' are mass-assignable
        // 'id' is implicitly guarded via autoIncrement
      }
    );
  }
}

// Initialize the model
CommissionTax.init();

module.exports = CommissionTax;