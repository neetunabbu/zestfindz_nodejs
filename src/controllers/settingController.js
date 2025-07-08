// src/controllers/settingController.js

const { Settings, Language } = require('../models');
const { successResponse, errorResponse } = require('../helpers/ApiResponse');
const cache = require('../utils/cache'); // ✅ corrected path
const { Translation } = require('../models');

const SettingController = {
  async settingsInfo(req, res) {
    try {
      const settings = await Settings.findAll();
      return successResponse(res, 'Settings fetched successfully', settings);
    } catch (err) {
      console.error('settingsInfo error:', err);
      return errorResponse(res, 'Failed to fetch settings');
    }
  },

  async translationsPaginate(req, res) {
    try {
      const language = req.query.lang || (await Language.findOne({ where: { default: true } }))?.locale;
      const cacheKey = `language-${language}`;

      let translations = cache.get(cacheKey);
      if (!translations) {
        translations = await Translation.findAll({
          where: { locale: language, status: 1 },
          attributes: ['key', 'value']
        });
        translations = Object.fromEntries(translations.map(t => [t.key, t.value]));
        cache.set(cacheKey, translations, 86400); // 1 day
      }

      return successResponse(res, 'Translations fetched', translations);
    } catch (err) {
      console.error('translationsPaginate error:', err);
      return errorResponse(res, 'Failed to fetch translations');
    }
  }
};

module.exports = SettingController;
