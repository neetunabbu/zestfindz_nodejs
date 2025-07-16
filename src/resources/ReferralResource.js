const TranslationResource = require('./TranslationResource');

module.exports = async function referralResource(referral) {
  if (!referral) return null;

  const locales = referral.translations
    ? referral.translations.map(t => t.locale)
    : null;

  return {
    id: referral.id ?? null,
    price_from: referral.price_from ?? null,
    price_to: referral.price_to ?? null,
    img: referral.img ?? null,
    expired_at: referral.expired_at
      ? new Date(referral.expired_at).toISOString()
      : null,
    created_at: referral.created_at
      ? new Date(referral.created_at).toISOString()
      : null,
    updated_at: referral.updated_at
      ? new Date(referral.updated_at).toISOString()
      : null,

    // Relations
    translation: referral.translation
      ? await TranslationResource(referral.translation)
      : null,

    translations: referral.translations
      ? await Promise.all(
          referral.translations.map(t => TranslationResource(t))
        )
      : [],

    locales: locales ?? [],
  };
};
