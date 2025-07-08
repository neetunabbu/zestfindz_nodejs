module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.BIGINT,   // PostgreSQL uses BIGSERIAL (BIGINT)
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    backward: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'languages',
    timestamps: false, // Original model had timestamps: false
    underscored: true,
    freezeTableName: true,
  });

  // ⚠️ Remove this association unless your galleries table has a `language_id` column.
  // If your `galleries` table *does not* have a `language_id` field — skip this
  /*
  Language.associate = (models) => {
    Language.hasMany(models.Gallery, {
      foreignKey: 'language_id',
      as: 'galleries',
    });
  };
  */

  return Language;
};
