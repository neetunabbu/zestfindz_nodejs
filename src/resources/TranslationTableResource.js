// resources/translationTableResource.js

/**
 * Format a Translation model instance into a response structure.
 *
 * @param {Object} translation - Sequelize instance of the Translation model
 * @returns {Object}
 */
function translationTableResource(translation) {
  if (!translation) return null;

  return {
    id: translation.id,
    group: translation.group,
    key: translation.key,
    value: {
      locale: translation.locale,
      value: translation.value,
    },
    created_at: translation.created_at
      ? translation.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,

    updated_at: translation.updated_at
      ? translation.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
  };
}

module.exports = translationTableResource;
