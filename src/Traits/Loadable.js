const { Gallery } = require('../models');
const config = require('../config/app'); // contains img_host
const path = require('path');

const Loadable = {
  /**
   * Uploads multiple gallery files related to a model
   * @param {Object} instance - Sequelize model instance (like Shop, Product, etc.)
   * @param {Array} files - Array of file paths or file data
   * @param {Object} req - Express request object (for previews etc.)
   * @param {String|null} type - Optional gallery type
   */
  uploads: async (instance, files = [], req, type = null) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const cleanedFile = file.replace(config.img_host, '');
      const title = path.basename(cleanedFile);
      const keys = cleanedFile.split('/');

      // Find matching type or default to 'other'
      const fileType = type || Object.values(Gallery.TYPES || {}).find(t => keys.includes(t)) || 'other';

      const image = await Gallery.create({
        title: title,
        path: `${config.img_host}${cleanedFile}`,
        type: fileType,
        size: req.body?.sizes?.[i] || null,
        mime: req.body?.mimeTypes?.[i] || null,
        preview: req.body?.previews?.[i] || null,
        loadableId: instance.id,
        loadableType: instance.constructor.name
      });

      // Optional: attach image to instance via association
      if (instance.galleries && typeof instance.galleries === 'function') {
        await instance.galleries().then(galleryCollection => {
          galleryCollection.push(image);
        });
      }
    }
  },

  /**
   * Get all galleries (like MorphMany)
   */
  galleries: async (instance) => {
    return Gallery.findAll({
      where: {
        loadableId: instance.id,
        loadableType: instance.constructor.name
      }
    });
  },

  /**
   * Get single gallery (like MorphOne)
   */
  gallery: async (instance) => {
    return Gallery.findOne({
      where: {
        loadableId: instance.id,
        loadableType: instance.constructor.name
      },
      order: [['id', 'DESC']]
    });
  }
};

module.exports = Loadable;
