module.exports = (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email_setting_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alt_body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    send_to: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'email_templates',
    timestamps: false,
    underscored: true
  });

  EmailTemplate.associate = function(models) {
    EmailTemplate.belongsTo(models.EmailSetting, {
      foreignKey: 'email_setting_id',
      as: 'email_setting',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return EmailTemplate;
};
