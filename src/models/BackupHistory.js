const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BackupHistory extends Model {
  static init() {
    super.init(
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
          type: DataTypes.BOOLEAN, // Cast to boolean as per Laravel's $casts
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
        timestamps: false, // Match Laravel's $timestamps = false
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.User, { foreignKey: 'created_by', as: 'user' });
  }

  // Replicate Laravel's getDates method
  getDates() {
    return ['created_at'];
  }
}

// Initialize the model
BackupHistory.init();

module.exports = BackupHistory;