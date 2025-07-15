// resources/simpleStoryResource.js

const shopResource = require('./ShopResource');

function formatDate(date) {
  return date
    ? new Date(date).toISOString().replace('T', ' ').split('.')[0] + 'Z'
    : null;
}

function simpleStoryResource(storyInstance) {
  if (!storyInstance) return null;

  return {
    id: storyInstance.id ?? undefined,
    file_urls: storyInstance.file_urls ?? undefined,
    created_at: storyInstance.created_at
      ? formatDate(storyInstance.created_at)
      : undefined,
    updated_at: storyInstance.updated_at
      ? formatDate(storyInstance.updated_at)
      : undefined,

    // Relation
    shop: storyInstance.shop
      ? shopResource(storyInstance.shop)
      : null,
  };
}

module.exports = simpleStoryResource;
