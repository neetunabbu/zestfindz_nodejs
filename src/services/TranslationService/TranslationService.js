const { Translation } = require('../models');
const ResponseError = require('../constants/responseError');
const cache = require('../cache'); // Assuming you have a cache module

class TranslationService {
  async create(data) {
    try {
      // Delete existing translations with the same key
      await Translation.destroy({ where: { key: data.key } });

      const value = data.value;
      const group = data.group;
      const status = data.status || 1;

      if (value && typeof value === 'object') {
        const promises = Object.entries(value).map(async ([locale, val]) => {
          const translation = await Translation.create({
            group,
            key: data.key,
            locale,
            status,
            value: val
          });

          try {
            cache.del(`language-${locale}`);
          } catch (error) {
            console.error('Cache deletion error:', error);
          }

          return translation;
        });

        await Promise.all(promises);
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      console.error('Translation creation error:', error);
      return { status: false, code: ResponseError.ERROR_502 };
    }
  }

  async update(data) {
    try {
      // Delete existing translations with the same key
      await Translation.destroy({ where: { key: data.key } });

      const value = data.value;
      const group = data.group;

      if (value && typeof value === 'object') {
        const promises = Object.entries(value).map(async ([locale, val]) => {
          const translation = await Translation.create({
            group,
            key: data.key,
            locale,
            value: val
          });

          try {
            cache.del(`language-${locale}`);
          } catch (error) {
            console.error('Cache deletion error:', error);
          }

          return translation;
        });

        await Promise.all(promises);
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      console.error('Translation update error:', error);
      return { status: false, code: ResponseError.ERROR_502 };
    }
  }

  async delete(ids = []) {
    try {
      if (ids && ids.length > 0) {
        await Translation.destroy({ where: { key: ids } });
      }
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      console.error('Translation deletion error:', error);
      return { status: false, code: ResponseError.ERROR_502 };
    }
  }
}

module.exports = new TranslationService();