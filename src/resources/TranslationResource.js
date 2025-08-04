// src/resources/TranslationResource.js

const BannerTranslation = require('../models/BannerTranslation');
const BlogTranslation = require('../models/BlogTranslation');
const FaqTranslation = require('../models/FaqTranslation');
const ReferralTranslation = require('../models/ReferralTranslation');
const ShopTranslation = require('../models/ShopTranslation');
const Translation = require('../models/Translation'); // main translation model

const formatTranslation = (translation) => {
  if (!translation) return null;

  return {
    id: Number(translation.id),
    locale: String(translation.locale),
    title: translation.title ? String(translation.title) : undefined,
    short_desc: translation.short_desc ? String(translation.short_desc) : undefined,
    description: translation.description ? String(translation.description) : undefined,
    button_text: translation.button_text ? String(translation.button_text) : undefined,
    address: translation.address ? String(translation.address) : undefined,
    question: translation.question ? String(translation.question) : undefined,
    answer: translation.answer ? String(translation.answer) : undefined,
    faq: translation.faq ? String(translation.faq) : undefined,
  };
};

module.exports = {
  formatTranslation,
};
