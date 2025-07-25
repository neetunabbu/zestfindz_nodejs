const { Product, Category, Tag, ProductProperty, MetaTag, Gallery, Stock, sequelize } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const ResponseError = require('../../helpers/ResponseError');
const SetTranslations = require('../../utils/setTranslations');
const UploadService = require('../upload/upload.service');
const { Op } = require('sequelize');

class ProductService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    try {
      const categoryId = data.category_id;

      if (categoryId && await this.checkIsParentCategory(categoryId)) {
        return {
          status: false,
          code: ResponseError.ERROR_501,
          message: `Parent category not allowed.`,
        };
      }

      const autoApprove = true; // Replace with your Settings query logic
      if (autoApprove) {
        data.status = 'published';
        data.active = true;
      }

      const product = await Product.create({ ...data });

      await SetTranslations.set(product, data);

      if (data.meta) {
        await product.setMetaTags(data.meta);
      }

      if (data.images && data.images.length > 0) {
        const preview = data.previews?.[0] || data.images[0];
        await product.update({ img: preview });
        await UploadService.uploadGallery(product, data.images);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await product.reload({ include: ['translations', 'metaTags'] }),
      };
    } catch (e) {
      console.error('Product creation failed', e);
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: e.message,
      };
    }
  }

  async update(uuid, data) {
    try {
      if (data.category_id && await this.checkIsParentCategory(data.category_id)) {
        return {
          status: false,
          code: ResponseError.ERROR_502,
          message: `Parent category not allowed.`,
        };
      }

      const product = await Product.findOne({ where: { uuid } });
      if (!product) return { status: false, code: ResponseError.ERROR_404 };

      data.status_note = null;
      await product.update(data);
      await SetTranslations.set(product, data);

      if (data.meta) {
        await product.setMetaTags(data.meta);
      }

      if (data.images && data.images.length > 0) {
        await product.galleries.destroy({ where: { loadable_id: product.id } });
        const preview = data.previews?.[0] || data.images[0];
        await product.update({ img: preview });
        await UploadService.uploadGallery(product, data.images);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await product.reload({ include: ['translations', 'metaTags'] }),
      };
    } catch (e) {
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: e.message,
      };
    }
  }

  async checkIsParentCategory(categoryId) {
    const parent = await Category.findOne({ where: { parent_id: categoryId } });
    return !!parent;
  }
   async parentSync(data) {
    const errorIds = [];

    for (const parentIdRaw of data.products || []) {
      const parentId = parseInt(parentIdRaw);

      try {
        await sequelize.transaction(async (t) => {
          const parent = await Product.findByPk(parentId, {
            include: ['translations', 'tags.translations', 'metaTags', 'galleries', 'properties'],
            transaction: t,
          });

          if (!parent || parent.parent_id) throw new Error('Product is child');

          const cloneAttrs = {
            ...parent.get(),
            parent_id: parent.id,
            shop_id: data.shop_id,
            uuid: uuidv4(),
          };

          delete cloneAttrs.id;
          const [clone] = await Product.upsert(cloneAttrs, { transaction: t });

          for (const tr of parent.translations) {
            await clone.createTranslation({
              locale: tr.locale,
              title: tr.title,
              description: tr.description,
            }, { transaction: t });
          }

          for (const meta of parent.metaTags) {
            await clone.createMetaTag({ ...meta.get(), model_id: clone.id, model_type: Product.name }, { transaction: t });
          }

          await clone.galleries.destroy({ where: { loadable_id: clone.id }, transaction: t });
          for (const gallery of parent.galleries) {
            await clone.createGallery({
              ...gallery.get(),
              loadable_id: clone.id,
              loadable_type: Product.name,
            }, { transaction: t });
          }

          for (const tag of parent.tags) {
            const newTag = await clone.createTag({ active: tag.active }, { transaction: t });
            for (const tr of tag.translations) {
              await newTag.createTranslation({
                locale: tr.locale,
                title: tr.title,
                description: tr.description,
              }, { transaction: t });
            }
          }

          for (const prop of parent.properties) {
            await ProductProperty.create({
              product_id: clone.id,
              property_group_id: prop.property_group_id,
              property_value_id: prop.property_value_id,
              value: prop.value,
            }, { transaction: t });
          }
        });
      } catch (e) {
        errorIds.push({ id: parentId, message: e.message });
      }
    }

    if (errorIds.length > 0) {
      return { status: false, code: ResponseError.ERROR_502, data: errorIds };
    }

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async delete(ids = [], shopId = null) {
    const errorIds = [];
    const products = await Product.findAll({
      where: {
        id: { [Op.in]: ids },
        ...(shopId ? { shop_id: shopId } : {})
      }
    });

    for (const product of products) {
      try {
        await product.destroy();
      } catch (e) {
        errorIds.push(product.id);
      }
    }

    if (errorIds.length === 0) {
      return { status: true, code: ResponseError.NO_ERROR };
    }

    return { status: false, code: ResponseError.ERROR_505, message: errorIds.join(', ') };
  }

  async setStatus(uuid, data) {
    const product = await Product.findOne({ where: { uuid }, include: ['stocks'] });

    if (!product) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    const availableStock = product.stocks?.find(stock => stock.quantity > 0);
    if (!availableStock) {
      return {
        status: false,
        code: ResponseError.ERROR_430,
      };
    }

    await product.update({
      status: data.status,
      status_note: data.status_note || ''
    });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: product
    };
  }
}
module.exports = ProductService;