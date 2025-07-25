const productResource = require('./productResource');
const shopResource = require('./shopResource');

const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const storyResource = (storyInstance) => {
  if (!storyInstance) return null;

  return {
    id: storyInstance.id ?? null,
    file_urls: storyInstance.file_urls ?? null,
    created_at: formatDate(storyInstance.created_at),
    updated_at: formatDate(storyInstance.updated_at),

    // Relations
    product: storyInstance.product
      ? productResource(storyInstance.product)
      : null,
    shop: storyInstance.shop
      ? shopResource(storyInstance.shop)
      : null,
  };
};

module.exports = storyResource;
