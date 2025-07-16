const ParcelOptionTranslationResource = require('./ParcelOptionTranslationResource');

class ParcelOptionResource {
  constructor(parcelOption) {
    this.parcelOption = parcelOption;
  }

  toArray() {
    const option = this.parcelOption;
    const result = {};

    if (option.id) {
      result.id = option.id;
    }

    if (option.created_at) {
      result.created_at = new Date(option.created_at)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19) + 'Z';
    }

    if (option.updated_at) {
      result.updated_at = new Date(option.updated_at)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19) + 'Z';
    }

    if (option.translation) {
      result.translation = new ParcelOptionTranslationResource(option.translation).toArray();
    }

    if (option.translations && Array.isArray(option.translations)) {
      result.translations = option.translations.map(t => 
        new ParcelOptionTranslationResource(t).toArray()
      );
    }

    return result;
  }
}

module.exports = ParcelOptionResource;
