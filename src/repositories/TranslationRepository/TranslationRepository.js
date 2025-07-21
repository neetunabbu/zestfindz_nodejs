// File: D:/zestfindz_nodejs/src/repositories/TranslationRepository/TranslationRepository.js

const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { Translation } = require('../../models/Translation');

class TranslationRepository extends CoreRepository {
  getModelClass() {
    return Translation;
  }
}

module.exports = TranslationRepository;
