const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class EmailTemplate extends Model {
  static associate(models) {
    this.belongsTo(models.EmailSetting, { foreignKey: 'email_setting_id' });
  }
}

// Constants
EmailTemplate.TYPE_ORDER = 'order';
EmailTemplate.TYPE_SUBSCRIBE = 'subscribe';
EmailTemplate.TYPE_VERIFY = 'verify';

EmailTemplate.TYPES = {
  [EmailTemplate.TYPE_ORDER]: EmailTemplate.TYPE_ORDER,
  [EmailTemplate.TYPE_SUBSCRIBE]: EmailTemplate.TYPE_SUBSCRIBE,
  [EmailTemplate.TYPE_VERIFY]: EmailTemplate.TYPE_VERIFY,
};

EmailTemplate.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email_setting_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
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
    type: DataTypes.SMALLINT,
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
  sequelize,
  modelName: 'EmailTemplate',
  tableName: 'email_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true
});

module.exports = EmailTemplate;
