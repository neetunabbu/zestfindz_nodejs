const { Story } = require('../../models'); // Adjust as needed
const FileHelper = require('../../helpers/FileHelper'); // Must implement uploadFile and removal logic
const ResponseError = require('../../helpers/ResponseError'); // Your error code constants

class StoryService {
  // Create a new story
  async create(data) {
    try {
      await Story.create(data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: [],
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  // Update a story instance (story must be a Sequelize model)
  async update(story, data) {
    try {
      await story.update(data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: [],
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  // Delete stories by an array of IDs, optionally scoped to shop
  async delete(ids = [], shopId = null) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
        };
      }
      const where = { id: ids };
      if (shopId) where.shop_id = shopId;

      const stories = await Story.findAll({ where });
      for (const story of stories) {
        // Remove associated files if any
        await this.removeFiles(Array.isArray(story.file_urls) ? story.file_urls : []);
        await story.destroy();
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

  // Upload files for stories
  async uploadFiles(data) {
    const fileUrls = [];
    try {
      // data.files: [file, file, ...], each a multer file object, or buffer/filepath
      for (const file of data.files || []) {
        const result = await FileHelper.uploadFile(file, 'stories');
        if (!result.status) {
          throw new Error(result.message || 'Upload failed');
        }
        fileUrls.push(result.data);
      }
    } catch (e) {
      const msg = (e.message === 'Class "finfo" not found')
        ? 'You need on php file info extension'
        : e.message;
      return { status: false, code: ResponseError.ERROR_400, message: msg };
    }
    if (fileUrls.length === 0) {
      return {
        status: false,
        code: ResponseError.ERROR_508,
      };
    }
    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: fileUrls,
    };
  }

  // Remove files from storage
  async removeFiles(fileUrls) {
    for (const fileUrl of fileUrls) {
      try {
        // Implement path conversion if necessary.
        // For example, convert a storage URL to an actual server file path.
        // This will differ on your deployment/storage setup.
        await FileHelper.deleteFile(fileUrl);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

module.exports = StoryService;
