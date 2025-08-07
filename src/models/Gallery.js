// models/gallery.js
module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loadable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loadable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preview: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'galleries',
    timestamps: false,
    indexes: [
      {
        name: 'galleries_loadable_type_loadable_id_index',
        fields: ['loadable_type', 'loadable_id']
      },
      {
        name: 'galleries_loadable_id_index',
        fields: ['loadable_id']
      },
      {
        name: 'galleries_loadable_type_index',
        fields: ['loadable_type']
      }
    ],
    
  });
  Gallery.associate = function (models) {
// Optional: back reference to Review
    Gallery.belongsTo(models.Review, {
      foreignKey: 'loadable_id',
      constraints: false,
      as: 'review',
    });
  };

  return Gallery;
};

