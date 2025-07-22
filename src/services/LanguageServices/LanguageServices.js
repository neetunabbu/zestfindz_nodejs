// src/services/LanguageServices/LanguageServices.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Language } = require('../../models/Language');
const ResponseError = require('../../helpers/ResponseError');
const FileHelper = require('../../helpers/FileHelper');
const { sequelize } = require('../../config/db');
const NodeCache = require('node-cache');

const cache = new NodeCache();

class LanguageService {

    async create(data) {
        const t = await sequelize.transaction();
        try {
            let language = await Language.findOne({
                where: { locale: data.locale },
                transaction: t
            });

            if (language) {
                await language.update(data, { transaction: t });
            } else {
                language = await Language.create(data, { transaction: t });
            }

            await this.setDefault(language, data.default, t);

            if (data?.images?.[0]) {
                await language.destroyGalleries(t); // Assumes custom method
                await language.update({ img: data.images[0] }, { transaction: t });
                await language.uploads(data.images, t); // Assumes uploads() exists
            }

            await t.commit();

            return { status: true, code: ResponseError.NO_ERROR, data: language };

        } catch (err) {
            await t.rollback();
            return { status: false, code: ResponseError.ERROR_400, message: err.message };
        }
    }

    async update(languageInstance, data) {
        const t = await sequelize.transaction();
        try {
            await languageInstance.update(data, { transaction: t });

            const defaultFlag = languageInstance.default || data.default;

            await this.setDefault(languageInstance, defaultFlag, t);

            if (data?.images?.[0]) {
                await languageInstance.destroyGalleries(t); // Assumes custom method
                await languageInstance.update({ img: data.images[0] }, { transaction: t });
                await languageInstance.uploads(data.images, t); // Assumes uploads() exists
            }

            await t.commit();
            return { status: true, code: ResponseError.NO_ERROR, data: languageInstance };

        } catch (err) {
            await t.rollback();
            console.error(err);
            return { status: false, code: ResponseError.ERROR_400 };
        }
    }

    async delete(ids = []) {
        if (!Array.isArray(ids) || ids.length === 0) {
            return { status: false, code: ResponseError.ERROR_400, message: 'Invalid IDs' };
        }

        const languages = await Language.findAll({ where: { id: { [Op.in]: ids } } });

        for (const language of languages) {
            if (language.default || (await Language.count()) === 1) {
                continue;
            }

            FileHelper.deleteFile(`images/languages/${language.img}`); // Assumes sync or promise-based
            await language.destroy();
        }

        try {
            cache.del('languages-list');
        } catch (err) {
            // Safe to ignore
        }

        return { status: true, code: ResponseError.NO_ERROR };
    }

    async setLanguageDefault(id = null, defaultValue = null) {
        const language = await Language.findByPk(id);
        if (!language) {
            return { status: false, code: ResponseError.ERROR_404 };
        }

        return this.setDefault(language, defaultValue);
    }

    async setDefault(language, defaultVal, transaction = null) {
        if (defaultVal) {
            await Language.update(
                { default: false },
                { where: { default: true }, transaction }
            );
        }

        language.default = defaultVal || true;
        await language.save({ transaction });

        return { status: true, code: ResponseError.NO_ERROR };
    }
}

module.exports = new LanguageService();
