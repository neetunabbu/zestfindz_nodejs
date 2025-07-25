const { DataTypes } = require('sequelize');

// Gallery types (replace with actual types from your Gallery model)
const GALLERY_TYPES = ['image', 'video', 'document', 'other']; // Adjust based on Gallery::TYPES

// Image host (replace with your actual configuration)
const IMG_HOST = process.env.IMG_HOST || 'https://your-image-host.com'; // Set in .env

// Mixin to define the Loadable polymorphic relationships and upload functionality
const Loadable = (sequelize) => {
  return {
    // Define the morphMany and morphOne relationships with Gallery model
    defineRelationships: (Model, GalleryModel) => {
      // MorphMany: galleries
      Model.hasMany(GalleryModel, {
        foreignKey: {
          name: 'loadable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          loadable_type: Model.name
        },
        as: 'galleries'
      });

      // MorphOne: gallery
      Model.hasOne(GalleryModel, {
        foreignKey: {
          name: 'loadable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          loadable_type: Model.name
        },
        as: 'gallery'
      });
    },

    // Upload files functionality
    uploads: async (instance, files, type = '') => {
      const GalleryModel = sequelize.models.Gallery;

      for (const [key, file] of Object.entries(files)) {
        // Remove image host from file path
        const cleanPath = file.replace(IMG_HOST, '');

        // Extract title from path (after first '/')
        const title = cleanPath.split('/').slice(1).join('/') || cleanPath;

        // Determine type from path or provided type, default to 'other'
        const pathSegments = cleanPath.split('/');
        const detectedType = GALLERY_TYPES.find((t) => pathSegments.includes(t)) || 'other';
        const finalType = type || detectedType;

        // Create gallery entry
        await GalleryModel.create({
          title,
          path: `${IMG_HOST}${cleanPath}`,
          type: finalType,
          size: file.size || null, // Assumes file object has size
          mime: file.mimeType || file.type || null, // Assumes file object has mimeType or type
          preview: file.preview || null, // Assumes preview is passed in file object or request
          loadable_id: instance.id,
          loadable_type: instance.constructor.name
        });
      }
    }
  };
};

module.exports = Loadable;