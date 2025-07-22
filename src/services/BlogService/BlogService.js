// File: src/services/BlogService/BlogService.js

'use strict';
const { Op } = require('sequelize');
const { Blog } = require('../../models/Blog');
const { Translation } = require('../../models/Translation');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/db');

class BlogService extends CoreService {
  getModelClass() {
    return Blog;
  }

  async create(data, authUserId) {
    try {
      data.type = Blog.TYPES?.[data?.type || 'blog'];
      const blog = await this.model().create({
        uuid: uuidv4(),
        user_id: authUserId,
        category_id: data.category_id,
        ...data,
      });

      await this.setTranslations(blog, data);

      if (data.images?.[0]) {
        await blog.uploads(data.images);
        await blog.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: blog };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_400, message: ResponseError.ERROR_501 };
    }
  }

  async update(uuid, data) {
    try {
      const blog = await this.model().findOne({ where: { uuid } });

      if (!blog) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      data.type = Blog.TYPES?.[data?.type || 'blog'];
      await blog.update(data);
      await this.setTranslations(blog, data);

      if (data.images?.[0]) {
        await blog.galleries().destroy();
        await blog.uploads(data.images);
        await blog.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_400, message: ResponseError.ERROR_400 };
    }
  }

  async delete(ids = []) {
    const blogs = await this.model().findAll({ where: { id: ids } });

    for (const blog of blogs) {
      try {
        await blog.galleries().destroy();
      } catch (e) {
        this.error(e);
      }

      await blog.destroy();

      await db('push_notifications')
        .where('model_type', 'Blog')
        .andWhere('model_id', blog.id)
        .del();
    }

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async setActiveStatus(blog) {
    try {
      await blog.update({ active: !blog.active });
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: ResponseError.ERROR_502 };
    }
  }

  async blogPublish(blog) {
    try {
      await blog.update({ published_at: new Date() });
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: ResponseError.ERROR_502 };
    }
  }

  async setTranslations(blog, data) {
    const titles = data.title;

    if (Array.isArray(titles) || typeof titles === 'object') {
      await blog.translations().destroy();
    }

    for (const [locale, value] of Object.entries(titles || {})) {
      await blog.translation().create({
        locale,
        title: value,
        short_desc: data.short_desc?.[locale],
        description: data.description?.[locale],
      });
    }
  }
}

module.exports = new BlogService();
