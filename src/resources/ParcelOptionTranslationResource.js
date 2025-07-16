class ParcelOptionTranslationResource {
  constructor(translation) {
    this.translation = translation;
  }

  toArray() {
    const t = this.translation;
    const result = {};

    if (t.id) result.id = t.id;
    if (t.parcel_option_id) result.parcel_option_id = t.parcel_option_id;
    if (t.locale) result.locale = t.locale;
    if (t.title) result.title = t.title;

    return result;
  }
}

module.exports = ParcelOptionTranslationResource;
