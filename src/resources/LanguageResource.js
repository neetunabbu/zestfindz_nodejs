// resources/LanguageResource.js

class LanguageResource {
  static toJson(language) {
    return {
      id: language.id,
      title: language.title,
      locale: language.locale,
      backward: Boolean(language.backward),
      default: Boolean(language.default),
      active: Boolean(language.active),
      img: language.img,
    };
  }
}

module.exports = LanguageResource;
