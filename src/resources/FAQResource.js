const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().replace('.000Z', 'Z');
};

const faqResource = (faq) => {
  if (!faq) return null;

  const locales = faq.translations?.map(t => t.locale) || null;

  return {
    id: parseInt(faq.id),
    uuid: String(faq.uuid),
    type: faq.type ? String(faq.type) : null,
    active: Boolean(faq.active),
    created_at: formatDateTime(faq.created_at),
    updated_at: formatDateTime(faq.updated_at),

    // Associations
    translation: faq.translation
      ? require('./translationResource')(faq.translation)
      : undefined,

    translations: faq.translations
      ? faq.translations.map(t => require('./translationResource')(t))
      : undefined,

    locales: locales || undefined,

    // category: faq.category
    //   ? require('./faqCategoryResource')(faq.category)
    //   : undefined,
  };
};

module.exports = faqResource;
