const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // your PostgreSQL connection

class BackupHistory extends Model {}

BackupHistory.init(
  {
    id: {
      type: DataTypes.BIGINT, // match with BIGSERIAL
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    path: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT, // ✅ match PostgreSQL BIGINT
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
    timestamps: false, // ✅ Laravel compatibility
    underscored: true, // optional: if using snake_case fields
  }
);

// ✅ Associations
BackupHistory.associate = (models) => {
  BackupHistory.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = BackupHistory;
