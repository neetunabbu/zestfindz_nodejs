module.exports = (sequelize, DataTypes) => {
  const EmailSetting = sequelize.define('EmailSetting', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    smtp_auth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    smtp_debug: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    host: {
      type: DataTypes.STRING(92),
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 465,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from_to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from_site: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ssl: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    active: {
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
    }
  }, {
    tableName: 'email_settings',
    timestamps: false,
    underscored: true,
  });

  return EmailSetting;
};
