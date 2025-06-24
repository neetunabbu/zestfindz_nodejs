const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BlogCategory extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'BlogCategory',
        tableName: 'blog_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
      }
    );
  }

  static associate(models) {
    // Relationships
    this.hasMany(models.Blog, { foreignKey: 'category_id', sourceKey: 'id', as: 'blogs' });
  }
}

// Initialize the model
BlogCategory.init();

module.exports = BlogCategory;