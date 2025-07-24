const db = require('../../models');
const CoreService = require('../CoreService'); 
class BlogService extends CoreService {
  constructor(language = null, currency = null) {
    super(language, currency);
    this.model = db.Blog;  
  }

  getModelClass() {
    return this.model;
  }

  async create(data, authUserId) {
    try {
      data.type = Blog.TYPES?.[data?.type || 'blog'];

      const blog = await this.model().create({
        uuid: data.uuid || require('uuid').v4(),
        user_id: authUserId,
        category_id: data.category_id,
        ...data,
      });

      
      if (typeof this.setTranslations === 'function') {
        await this.setTranslations(blog, data);
      }

      if (data.images?.[0]) {
        await blog.uploads(data.images);       
        await blog.update({ img: data.images[0] });
      }

      return { status: true, code: 0, data: blog };

    } catch (e) {
      console.error(e);
      return { status: false, code: 400, message: e.message || 'Error creating blog' };
    }
  }
}

module.exports = BlogService;
