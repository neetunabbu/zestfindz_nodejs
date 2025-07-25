
module.exports = (sequelize, DataTypes) => {
  const WarehouseClosedDate = sequelize.define('WarehouseClosedDate', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
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
  }, {
    tableName: 'warehouse_closed_dates',
    timestamps: true,
    underscored: true,
  });

  WarehouseClosedDate.associate = (models) => {
    WarehouseClosedDate.belongsTo(models.Warehouse, {
      foreignKey: 'warehouse_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return WarehouseClosedDate;
};
