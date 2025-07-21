const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Page = sequelize.define('Page', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'about',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bg_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buttons: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isJsonValid(value) {
          if (value && typeof value !== 'object') {
            throw new Error('Buttons must be a valid JSON object or null.');
          }
        }
      }
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
    tableName: 'pages',
    timestamps: false, // Disable auto timestamps
    underscored: true,
  });

  return Page;
};
