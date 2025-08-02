module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    position: {
      type: DataTypes.ENUM('before', 'after'),
      allowNull: false,
      defaultValue: 'after',
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
    tableName: 'units',
    timestamps: false, 
    underscored: true, 
  });

  Unit.associate = (models) => {
    Unit.hasMany(models.Product, {
      foreignKey: 'unit_id',
      as: 'products',
    });
  };

  return Unit;
};
