const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Blog extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        uuid: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        published_at: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        img: {
          type: DataTypes.STRING,
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
        r_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        r_avg: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        r_sum: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Blog',
        tableName: 'blogs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is already BOOLEAN, no additional casting needed
      }
    );
  }

  // Constants
  static TYPES = {
    blog: 1,
    notification: 2,
  };

  // Traits (to be implemented separately as needed)
  // Loadable: Custom trait for loading-related functionality
  // Reviewable: Custom trait for review-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.BlogTranslation, { foreignKey: 'blog_id', as: 'translations' });
    this.hasOne(models.BlogTranslation, { foreignKey: 'blog_id', as: 'translation' });
  }

  // Replicate Laravel's getTypeAttribute accessor
  get type() {
    return this.getDataValue('type') === '2' ? 'notification' : 'blog';
  }
}

// Initialize the model
Blog.init();

module.exports = Blog;