const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BlogTranslation extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        blog_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        locale: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        short_desc: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'BlogTranslation',
        tableName: 'blog_translations',
        timestamps: false, // Match Laravel's $timestamps = false
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
      }
    );
  }

  static associate(models) {
    // No relationships defined in the Laravel model
  }
}

// Initialize the model
BlogTranslation.init();

module.exports = BlogTranslation;