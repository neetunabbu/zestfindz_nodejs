module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'roles',
    timestamps: false
  });

  Role.associate = (models) => {
  Role.belongsToMany(models.User, {
    as: 'users',
    through: {
      model: models.ModelHasRole,
      scope: {
        model_type: 'User',
      },
    },
    foreignKey: 'role_id',
    otherKey: 'model_id',
    constraints: false,
  });
};


  return Role;
};


