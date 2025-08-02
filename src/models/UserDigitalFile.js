const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserDigitalFile = sequelize.define('UserDigitalFile', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    downloaded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    digital_file_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
    tableName: 'user_digital_files',
    underscored: true,
    timestamps: false, // Laravel disables timestamps
  });

  UserDigitalFile.associate = (models) => {
    UserDigitalFile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    UserDigitalFile.belongsTo(models.DigitalFile, {
      foreignKey: 'digital_file_id',
      as: 'digitalFile',
    });
  };

  // Custom scopes (equivalent to Laravel scopes)
  UserDigitalFile.addScope('active', {
    where: {
      active: true,
    },
  });

  UserDigitalFile.addScope('filter', (filter = {}) => {
    const conditions = {};
    if (filter.digital_file_id) {
      conditions.digital_file_id = filter.digital_file_id;
    }
    if (filter.user_id) {
      conditions.user_id = filter.user_id;
    }
    if (typeof filter.active !== 'undefined') {
      conditions.active = filter.active;
    }
    return { where: conditions };
  });

  return UserDigitalFile;
};
