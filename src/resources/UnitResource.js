const { translationResource } = require('./TranslationResource');

function unitResource(unit) {
  const formatDate = (date) =>
    date ? new Date(date).toISOString().replace('T', ' ').replace('.000Z', 'Z') : null;

  const locales = unit.translations ? unit.translations.map(t => t.locale) : null;

  return {
    id: Number(unit.id),
    active: Boolean(unit.active),
    position: unit.position?.toString() ?? null,
    created_at: formatDate(unit.created_at),
    updated_at: formatDate(unit.updated_at),

    // Relations
    translation: unit.translation ? translationResource(unit.translation) : null,
    translations: unit.translations ? unit.translations.map(translationResource) : [],
    locales,
  };
}

module.exports = { unitResource };
