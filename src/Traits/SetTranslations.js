const { Sequelize } = require('sequelize');
const slugify = require('slugify');
const loggable= require('./loggableMixin');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Mixin for translation handling
const SetTranslations = (sequelize) => {
  return {
    // Set translations for a model
    async setTranslations(model, data) {
      LoggableMixin.error(new Error(`[SetTranslations] setTranslations called: model=${model.constructor.name}, model_id=${model.id}, data=${JSON.stringify(data)}`));

      const TranslationModel = sequelize.models[`${model.constructor.name}Translation`];
      const LanguageModel = sequelize.models.Language;

      try {
        // Get default locale
        const defaultLanguage = await LanguageModel.findOne({ where: { default: 1 } });
        const defaultLocale = defaultLanguage?.locale || 'en';

        // If title is an object (array-like in PHP), delete existing translations
        const title = dataGet(data, 'title', {});
        if (typeof title === 'object' && !Array.isArray(title)) {
          await TranslationModel.destroy({ where: { translatable_id: model.id, translatable_type: model.constructor.name } });
        }

        // Set slug if applicable
        try {
          await this.setSlug(model, title, defaultLocale);
        } catch (error) {
          LoggableMixin.error(new Error(`[SetTranslations] setSlug failed: ${error.message}`));
        }

        // Create translations
        for (const [locale, value] of Object.entries(title)) {
          await TranslationModel.create({
            translatable_id: model.id,
            translatable_type: model.constructor.name,
            title: value,
            locale,
            description: dataGet(data, `description.${locale}`, ''),
            address: dataGet(data, `address.${locale}`, ''),
            button_text: dataGet(data, `button_text.${locale}`, '')
          });
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[SetTranslations] Error in setTranslations: ${error.message}`));
        throw error;
      }
    },

    // Generate and set slug for specific models
    async setSlug(model, title, defaultLocale) {
      const classes = ['Shop', 'Category', 'Brand', 'Product'];

      LoggableMixin.error(new Error(`[SetTranslations] setSlug called: model=${model.constructor.name}, model_id=${model.id}, title=${JSON.stringify(title)}, defaultLocale=${defaultLocale}`));

      if (classes.includes(model.constructor.name) && title[defaultLocale]) {
        const slug = `${slugify(title[defaultLocale], { lower: true, locale: defaultLocale })}-${model.id}`;
        
        LoggableMixin.error(new Error(`[SetTranslations] Updating slug: slug=${slug}`));

        await model.update({ slug });
      }
    }
  };
};

module.exports = SetTranslations;