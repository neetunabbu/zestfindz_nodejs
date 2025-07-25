const { ShopTag, ShopTagTranslation } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const { setTranslations } = require('../../utils/setTranslations');

class ShopTagService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Create a new shop tag
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const shopTag = await ShopTag.create(data);

      // Set multilingual translations
      await setTranslations(shopTag, data);

      // Upload and attach images
      if (data?.images?.[0]) {
        await shopTag.uploads(data.images); // custom helper/method assumed
        await shopTag.update({ img: data.images[0] });
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: shopTag,
      };
    } catch (e) {
      console.error('ShopTagService.create error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  /**
   * Update a shop tag
   * @param {Instance} shopTag
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(shopTag, data) {
    try {
      await shopTag.update(data);

      await setTranslations(shopTag, data);

      if (data?.images?.[0]) {
        await shopTag.galleries().destroy(); // delete existing images
        await shopTag.uploads(data.images);  // upload new ones
        await shopTag.update({ img: data.images[0] });
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: shopTag,
      };
    } catch (e) {
      console.error('ShopTagService.update error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  /**
   * Delete shop tags and their translations
   * @param {Array<number>} ids
   * @returns {Promise<Object>}
   */
  async delete(ids = []) {
    try {
      const shopTags = await ShopTag.findAll({ where: { id: ids } });

      for (const tag of shopTags) {
        await ShopTagTranslation.destroy({ where: { shop_tag_id: tag.id } });
        await tag.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };
    } catch (e) {
      console.error('ShopTagService.delete error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }
}

module.exports = ShopTagService;
