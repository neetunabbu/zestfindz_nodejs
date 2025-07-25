// const { Op } = require('sequelize');
// const { Currency, Language } = require('../../models');
// const cache = require('../../utils/cache'); // e.g., Redis or memory-cache
// const logger = require('../../utils/logger');

// class BaseService {
//   constructor(Model) {
//     this.Model = Model;
//     this.language = this.setLanguage();
//     this.currency = this.setCurrency();
//   }

//   async setCurrency() {
//     const currencyId = global?.request?.query?.currency_id;
//     if (currencyId) return currencyId;

//     const defaultCurrency = await Currency.findOne({ where: { default: true } });
//     return defaultCurrency?.id ?? null;
//   }

//   async setLanguage() {
//     const lang = global?.request?.query?.lang;
//     if (lang) return lang;

//     const defaultLang = await Language.findOne({ where: { default: true } });
//     return defaultLang?.locale ?? 'en';
//   }

//   async destroy(ids = []) {
//     try {
//       const items = await this.Model.findAll({ where: { id: ids } });

//       for (const item of items) {
//         await item.destroy();
//       }

//       await cache.flush(); // Optional depending on if cache is used
//     } catch (error) {
//       logger.error('Destroy error:', error);
//     }
//   }

//   async delete(ids = []) {
//     return this.destroy(ids);
//   }

//   async dropAll(exclude = {}) {
//     try {
//       const where = exclude?.column
//         ? { [exclude.column]: { [Op.ne]: exclude.value } }
//         : {};

//       const items = await this.Model.findAll({ where });

//       for (const item of items) {
//         await item.destroy();
//       }

//       await cache.flush();
//     } catch (error) {
//       logger.error('DropAll error:', error);
//     }
//   }

//   async remove(ids = [], column = 'id', when = {}) {
//     const where = {
//       [column]: ids,
//       ...(when?.column ? { [when.column]: when.value } : {}),
//     };

//     try {
//       const items = await this.Model.findAll({ where });

//       const errorIds = [];

//       for (const item of items) {
//         try {
//           await item.destroy();
//         } catch (error) {
//           logger.error('Remove error:', error);
//           errorIds.push(item.id);
//         }
//       }

//       if (errorIds.length > 0) {
//         return {
//           status: false,
//           code: 'ERROR_505',
//           message: `Cannot delete items with IDs: ${errorIds.join(', ')}`
//         };
//       }

//       return { status: true, code: 'NO_ERROR' };
//     } catch (error) {
//       logger.error('Remove outer error:', error);
//       return { status: false, code: 'ERROR_500', message: error.message };
//     }
//   }
// }

// module.exports = BaseService;
