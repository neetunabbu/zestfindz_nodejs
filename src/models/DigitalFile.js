const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DigitalFile extends Model {}

DigitalFile.init({
  id: {
    type: DataTypes.BIGINT,   // matches BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_id: {
    type: DataTypes.BIGINT,   // BIGINT and NOT NULL
    allowNull: false
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  modelName: 'DigitalFile',
  tableName: 'digital_files',
  timestamps: false,
  underscored: true,
  freezeTableName: true
});

// ⚠️ Remove or comment out associations if not required (as per your earlier no-association request)
// DigitalFile.associate = (models) => {
//   this.belongsTo(models.Product, { foreignKey: 'product_id' });
//   this.hasOne(models.UserDigitalFile, { foreignKey: 'digital_file_id', as: 'userDigital' });
//   this.hasMany(models.UserDigitalFile, { foreignKey: 'digital_file_id', as: 'usersDigital' });
// };

module.exports = DigitalFile;
