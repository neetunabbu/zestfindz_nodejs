// models/ExtraGroup.js
module.exports = (sequelize, DataTypes) => {
  const ExtraGroup = sequelize.define('ExtraGroup', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'extra_groups',
    timestamps: false,
    underscored: true,
  });

  ExtraGroup.associate = (models) => {
    // Belongs to Shop
    ExtraGroup.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // Has many StockExtras
    ExtraGroup.hasMany(models.StockExtra, {
      foreignKey: 'extra_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ExtraGroup;
};
