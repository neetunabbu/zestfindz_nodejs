// models/ExtraValue.js
module.exports = (sequelize, DataTypes) => {
  const ExtraValue = sequelize.define('ExtraValue', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    extra_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'extra_values',
    timestamps: false,
    underscored: true,
  });

  ExtraValue.associate = (models) => {
    // belongsTo ExtraGroup
    ExtraValue.belongsTo(models.ExtraGroup, {
      foreignKey: 'extra_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // hasMany StockExtra (if needed)
    ExtraValue.hasMany(models.StockExtra, {
      foreignKey: 'extra_value_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ExtraValue;
};
