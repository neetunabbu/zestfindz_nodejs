// services/tagService.js

const { Tag } = require('../../models'); // Adjust path as needed
const ResponseError = require('../../helpers/ResponseError'); // Adjust path
// Placeholder for your translation utility
const setTranslations = async (tag, data) => {
  // Implement translation save logic (e.g., tag.setTranslations([...]))
  // For now, this is a stub function
};

class TagService {
  // Create a new tag
  async create(data) {
    try {
      const tag = await Tag.create(data);
      await setTranslations(tag, data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: []
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  // Update a tag instance
  async update(tag, data) {
    try {
      await tag.update(data);
      if (data.title && Object.keys(data.title).length > 0) {
        await setTranslations(tag, data);
      }
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: []
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  // Delete tags by IDs (optionally filter by shopId)
  async delete(ids = [], shopId = null) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return { status: false, code: ResponseError.ERROR_400 };
      }

      const where = { id: ids };
      const tags = await Tag.findAll({ where });

      for (const tag of tags) {
        // If shopId is provided and the tag's product's shop_id is not a match, skip
        if (shopId && tag.product && tag.product.shop_id !== shopId) {
          continue;
        }
        await setTranslations(tag, {});
        await tag.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };

    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }
}

module.exports = TagService;
