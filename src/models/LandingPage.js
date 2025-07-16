// models/LandingPage.js

module.exports = (sequelize, DataTypes) => {
  const LandingPage = sequelize.define('LandingPage', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isJson(value) {
          if (typeof value !== 'object') {
            throw new Error('Data must be a valid JSON object');
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
    }
  }, {
    tableName: 'landing_pages',
    timestamps: false, // manually manage timestamps if needed
    underscored: true, // for snake_case column names
  });

  return LandingPage;
};
