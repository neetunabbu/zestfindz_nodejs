// models/delivery_point_working_day.model.js

module.exports = (sequelize, DataTypes) => {
  const DeliveryPointWorkingDay = sequelize.define('DeliveryPointWorkingDay', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    delivery_point_id: {
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
    tableName: 'delivery_point_working_days',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  DeliveryPointWorkingDay.associate = (models) => {
    DeliveryPointWorkingDay.belongsTo(models.DeliveryPoint, {
      foreignKey: 'delivery_point_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return DeliveryPointWorkingDay;
};
