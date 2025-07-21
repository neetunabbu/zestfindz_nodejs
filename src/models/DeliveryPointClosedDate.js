// models/delivery_point_closed_date.model.js

module.exports = (sequelize, DataTypes) => {
  const DeliveryPointClosedDate = sequelize.define('DeliveryPointClosedDate', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    delivery_point_id: {
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
    tableName: 'delivery_point_closed_dates',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  DeliveryPointClosedDate.associate = (models) => {
    DeliveryPointClosedDate.belongsTo(models.DeliveryPoint, {
      foreignKey: 'delivery_point_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return DeliveryPointClosedDate;
};

