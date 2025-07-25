'use strict';

module.exports = (sequelize, DataTypes) => {
  const WarehouseWorkingDay = sequelize.define('WarehouseWorkingDay', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouse_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '9:00',
    },
    to: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '21:00',
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'warehouse_working_days',
    underscored: true,
    timestamps: false, // Set to true if you want Sequelize to manage createdAt/updatedAt
  });

  WarehouseWorkingDay.associate = function(models) {
    WarehouseWorkingDay.belongsTo(models.Warehouse, {
      foreignKey: 'warehouse_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return WarehouseWorkingDay;
};
