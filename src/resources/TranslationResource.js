// Import all translation models
const { BannerTranslation } = require("../models/BannerTranslation");
const { BlogTranslation } = require("../models/BlogTranslation");
const { FaqTranslation } = require("../models/FaqTranslation");
const { CategoryTranslation } = require("../models/CategoryTranslation");
const { PageTranslation } = require("../models/PageTranslation");
// const { QuestionTranslation } = require("../Models/QuestionTranslation");

/**
 * Resource transformer for translation objects.
 * Mimics Laravel's JsonResource-style transformation.
 *
 * @param {Object} translation - The translation model instance.
 * @returns {Object|null} - Transformed object or null if input is invalid.
 */
function TranslationResource(translation) {
    if (!translation) return null;

    return {
        id: Number(translation.id),
        locale: String(translation.locale),
        title: translation.title ?? undefined,
        short_desc: translation.short_desc ?? undefined,
        description: translation.description ?? undefined,
        button_text: translation.button_text ?? undefined,
        address: translation.address ?? undefined,
        question: translation.question ?? undefined,
        answer: translation.answer ?? undefined,
        faq: translation.faq ?? undefined
    };
}

module.exports = TranslationResource;
