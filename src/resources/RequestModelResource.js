const { Category, Language, RequestModel } = require('../models');
const UserResource = require('./userResource');
// You must also import all dynamic model resources you expect (like ProductResource, CategoryResource, etc.)
const ProductResource = require('./ProductResource');
const CategoryResource = require('./CategoryResource');

const RequestModelResource = async (instance, lang = null) => {
  if (!instance) return null;

  // Get default locale if not provided
  if (!lang) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    lang = defaultLang?.locale || 'en';
  }

  const locale = lang;

  // Determine model type and resource dynamically
  const modelType = instance.model_type?.replace('App\\Models\\', '');
  let ModelResource = null;

  switch (modelType) {
    case 'Product':
      ModelResource = ProductResource;
      break;
    case 'Category':
      ModelResource = CategoryResource;
      break;
    default:
      ModelResource = null;
  }

  // Load parent if needed
  let parent = null;
  const parentId = instance?.data?.parent_id;
  if (parentId) {
    parent = await Category.findByPk(parentId, {
      include: [{
        association: 'translation',
        where: { locale },
        required: false,
      }],
    });
  }

  return {
    id: instance.id || null,
    model_id: instance.model_id || null,
    model_type: RequestModel.BY_TYPES?.[instance.model_type] || instance.model_type,
    created_by: instance.created_by || null,
    data: instance.data || null,
    status: instance.status || null,
    status_note: instance.status_note || null,
    model: instance.model && ModelResource ? await ModelResource(instance.model) : null,
    createdBy: instance.createdBy ? await UserResource(instance.createdBy) : null,
    parent: parent || null,
    created_at: instance.created_at ? instance.created_at.toISOString().replace('T', ' ').replace('Z', '') + 'Z' : null,
    updated_at: instance.updated_at ? instance.updated_at.toISOString().replace('T', ' ').replace('Z', '') + 'Z' : null,
  };
};

module.exports = RequestModelResource;
