const galleryResource = require('./GalleryResource');
const translationResource = require('./TranslationResource');

const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const shopTagResource = (shopTagInstance) => {
  if (!shopTagInstance) return null;

  const locales = Array.isArray(shopTagInstance.translations)
    ? shopTagInstance.translations.map(t => t.locale)
    : null;

  return {
    id: shopTagInstance.id ?? null,
    img: shopTagInstance.img ?? null,
    created_at: formatDate(shopTagInstance.created_at),
    updated_at: formatDate(shopTagInstance.updated_at),

    // Relations
    galleries: Array.isArray(shopTagInstance.galleries)
      ? shopTagInstance.galleries.map(galleryResource)
      : [],
    translation: shopTagInstance.translation
      ? translationResource(shopTagInstance.translation)
      : null,
    translations: Array.isArray(shopTagInstance.translations)
      ? shopTagInstance.translations.map(translationResource)
      : [],
    locales: locales ?? null,
  };
};

// Add a .collection() method for array mapping (like Laravel)
shopTagResource.collection = (items) => {
  return Array.isArray(items) ? items.map(shopTagResource) : [];
};

module.exports = shopTagResource;
