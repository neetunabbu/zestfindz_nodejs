const CategoryResource = require('./CategoryResource');
const TranslationResource = require('./TranslationResource');
const GalleryResource = require('./GalleryResource');

class PageResource {
  constructor(page) {
    this.page = page;
  }

  toArray() {
    const page = this.page;
    const result = {};

    if (page.id) result.id = page.id;
    if (page.type) result.type = page.type;
    if (page.img) result.img = page.img;
    if (page.bg_img) result.bg_img = page.bg_img;
    if (page.active) result.active = page.active;
    if (page.buttons) result.buttons = page.buttons;

    if (page.created_at) {
      result.created_at = new Date(page.created_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
    }

    if (page.updated_at) {
      result.updated_at = new Date(page.updated_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
    }

    if (page.category) {
      result.category = new CategoryResource(page.category).toArray();
    }

    if (page.translation) {
      result.translation = new TranslationResource(page.translation).toArray();
    }

    if (page.translations && Array.isArray(page.translations)) {
      result.translations = page.translations.map(t => new TranslationResource(t).toArray());
      result.locales = page.translations.map(t => t.locale);
    }

    if (page.galleries && Array.isArray(page.galleries)) {
      result.galleries = page.galleries.map(g => new GalleryResource(g).toArray());
    }

    return result;
  }
}

module.exports = PageResource;
