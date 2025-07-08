const { DataTypes } = require('sequelize');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Mixin to define the MetaTagable polymorphic relationship and meta tag functionality
const MetaTagable = (sequelize) => {
  return {
    // Define the morphMany relationship with MetaTag model
    defineRelationships: (Model, MetaTagModel) => {
      Model.hasMany(MetaTagModel, {
        foreignKey: {
          name: 'model_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          model_type: Model.name
        },
        as: 'metaTags'
      });
    },

    // Set meta tags functionality
    setMetaTags: async (instance, data) => {
      const MetaTagModel = sequelize.models.MetaTag;
      const metaTags = dataGet(data, 'meta', []);

      // Delete existing meta tags if metaTags is an array
      if (Array.isArray(metaTags)) {
        await MetaTagModel.destroy({
          where: {
            model_id: instance.id,
            model_type: instance.constructor.name
          }
        });
      }

      // Create new meta tags
      for (const value of Array.isArray(metaTags) ? metaTags : []) {
        await MetaTagModel.create({
          model_id: instance.id,
          model_type: instance.constructor.name,
          path: dataGet(value, 'path'),
          title: dataGet(value, 'title'),
          keywords: dataGet(value, 'keywords'),
          description: dataGet(value, 'description'),
          h1: dataGet(value, 'h1'),
          seo_text: dataGet(value, 'seo_text'),
          canonical: dataGet(value, 'canonical'),
          robots: dataGet(value, 'robots'),
          change_freq: dataGet(value, 'change_freq'),
          priority: dataGet(value, 'priority')
        });
      }
    }
  };
};

module.exports = MetaTagable;