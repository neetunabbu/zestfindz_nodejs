const TranslationResource = require('./TranslationResource');
const UserResource = require('./UserResource');

class BlogResource {
  constructor(blog, options = {}) {
    this.blog = blog;
    this.includeRelations = options.includeRelations || false;
  }

  toJSON() {
    const blog = this.blog;

    const locales = blog.translations?.map(t => t.locale) ?? null;

    return {
      id: Number(blog.id),
      uuid: String(blog.uuid),
      user_id: blog.user_id ?? null,
      type: blog.type,
      published_at: blog.published_at ?? null,
      active: !!blog.active,
      img: blog.img ?? null,
      r_count: blog.r_count ?? null,
      r_avg: blog.r_avg ?? null,
      r_sum: blog.r_sum ?? null,
      created_at: blog.created_at ? blog.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null,
      updated_at: blog.updated_at ? blog.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null,

      // Relations
      translation: blog.translation ? new TranslationResource(blog.translation).toJSON() : null,
      translations: blog.translations ? blog.translations.map(t => new TranslationResource(t).toJSON()) : [],
      locales: locales ?? null,
      author: blog.author ? new UserResource(blog.author).toJSON() : null,
    };
  }
}

module.exports = BlogResource;
