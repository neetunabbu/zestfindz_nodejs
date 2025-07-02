const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class UserDigitalFile extends Model {
  static active(query) {
    return query.where({ active: true });
  }

  static filter(query, filter = {}) {
    return query
      .where(filter.digital_file_id ? { digital_file_id: filter.digital_file_id } : {})
      .where(filter.user_id ? { user_id: filter.user_id } : {})
      .where(filter.active !== undefined ? { active: filter.active } : {});
  }
}

UserDigitalFile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  digital_file_id: {
    type: DataTypes.INTEGER,
    allowNull: false         // ← corrected to false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false         // ← corrected to false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  downloaded: {
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
  modelName: 'UserDigitalFile',
  tableName: 'user_digital_files',
  timestamps: true,                 // ← corrected
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Relationships
UserDigitalFile.associate = (models) => {
  UserDigitalFile.belongsTo(models.DigitalFile, {
    foreignKey: 'digital_file_id',
    as: 'digitalFile'
  });

  UserDigitalFile.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = UserDigitalFile;
