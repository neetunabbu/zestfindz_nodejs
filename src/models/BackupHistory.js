// models/BackupHistory.js

module.exports = (sequelize, DataTypes) => {
  const BackupHistory = sequelize.define('BackupHistory', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
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
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'backup_histories',
    timestamps: false,
    underscored: true,
  });

  BackupHistory.associate = (models) => {
    BackupHistory.belongsTo(models.User, {
      foreignKey: 'created_by',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return BackupHistory;
};
