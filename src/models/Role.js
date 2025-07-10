
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guard_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    route_permissions: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isJson(value) {
          if (value && typeof value !== 'object') {
            throw new Error('route_permissions must be a valid JSON object or array');
          }
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'roles',
    timestamps: false,
    underscored: true,
  });

  return Role;
};
