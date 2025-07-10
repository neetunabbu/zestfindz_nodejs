const { Sequelize, Op } = require('sequelize');
const { validationResult, body, query } = require('express-validator');
const ExcelJS = require('exceljs');
const fs = require('fs').promises;
const path = require('path');
const ApiResponse = require('../../../../../Traits/ApiResponse');
const Loggable = require('../../../../../Traits/Loggable');
const GetShop = require('../../../../../helpers/GetShop');
const { v4: uuidv4 } = require('uuid');
const { Category } = require('../../../../../models/Category'); // Adjust the path as necessary
// Validation middleware
const validateCategoryCreate = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').optional().isIn(['main', 'sub_main', 'child', 'receipt']).withMessage('Invalid type')
];

const validateCategoryFilter = [
  query('type').optional().isIn(['main', 'sub_main', 'child', 'receipt']).withMessage('Invalid type'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('per_page').optional().isInt({ min: 1 }).toInt()
];

const validateFilterParams = [
  body('ids').optional().isArray().withMessage('IDs must be an array'),
  body('ids.*').optional().isString().withMessage('Each ID must be a string')
];

// Transform category data (mimics CategoryResource)
const transformCategory = (category) => ({
  id: category.id,
  uuid: category.uuid,
  shop_id: category.shop_id,
  img: category.img,
  active: category.active,
  translations: category.translations ? category.translations.map(t => ({
    locale: t.locale,
    title: t.title
  })) : [],
  metaTags: category.metaTags ? category.metaTags.map(m => ({
    key: m.key,
    value: m.value
  })) : []
});

// Category controller factory function
const CategoryController = (sequelize) => {
  const getShop = GetShop(sequelize);
  const Category = sequelize.models.Category;
  const CategoryTranslationModel = sequelize.models.CategoryTranslation;
  const CategoryMetaTagModel = sequelize.models.CategoryMetaTag;
  const types = ['main', 'sub_main', 'child', 'receipt'];

  return {
    // Get all categories
    async index(req, res) {
      try {
        await Promise.all(validateCategoryFilter.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const filter = { ...req.query };
        if (types.includes(filter.type)) {
          const shop = await getShop.shop(req);
          if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
          filter.shop_id = shop.id;
        }

        const categories = await Category.findAll({
          where: filter,
          include: [
            { model: CategoryTranslationModel, as: 'translations' },
            { model: CategoryMetaTagModel, as: 'metaTags' }
          ]
        });

        return ApiResponse.successResponse(res, 'Categories retrieved', categories.map(transformCategory));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in index: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Paginate categories
    async paginate(req, res) {
      try {
        await Promise.all(validateCategoryFilter.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const filter = { ...req.query };
        if (types.includes(filter.type)) {
          const shop = await getShop.shop(req);
          if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
          filter.shop_id = shop.id;
        }

        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 10;

        const { rows, count } = await Category.findAndCountAll({
          where: filter,
          include: [
            { model: CategoryTranslationModel, as: 'translations' },
            { model: CategoryMetaTagModel, as: 'metaTags' }
          ],
          limit: perPage,
          offset: (page - 1) * perPage
        });

        return ApiResponse.successResponse(res, 'Categories paginated', {
          data: rows.map(transformCategory),
          current_page: page,
          per_page: perPage,
          total: count,
          last_page: Math.ceil(count / perPage)
        });
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in paginate: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Select paginate (assumed for specific category types or filtering)
    async selectPaginate(req, res) {
      try {
        await Promise.all(validateCategoryFilter.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const filter = { ...req.query };
        if (types.includes(filter.type)) {
          const shop = await getShop.shop(req);
          if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
          filter.shop_id = shop.id;
        }

        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 10;

        const { rows, count } = await Category.findAndCountAll({
          where: filter,
          limit: perPage,
          offset: (page - 1) * perPage
        });

        return ApiResponse.successResponse(res, 'Categories selected', {
          data: rows.map(transformCategory),
          current_page: page,
          per_page: perPage,
          total: count,
          last_page: Math.ceil(count / perPage)
        });
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in selectPaginate: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // My select paginate (assumed for user-specific categories)
    async mySelectPaginate(req, res) {
      try {
        await Promise.all(validateCategoryFilter.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const filter = { ...req.query };
        if (types.includes(filter.type)) {
          const shop = await getShop.shop(req);
          if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
          filter.shop_id = shop.id;
        }

        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 10;

        const { rows, count } = await Category.findAndCountAll({
          where: filter,
          limit: perPage,
          offset: (page - 1) * perPage
        });

        return ApiResponse.successResponse(res, 'My categories selected', {
          data: rows.map(transformCategory),
          current_page: page,
          per_page: perPage,
          total: count,
          last_page: Math.ceil(count / perPage)
        });
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in mySelectPaginate: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Create a new category
    async store(req, res) {
      try {
        await Promise.all(validateCategoryCreate.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const validated = { ...req.body };
        if (types.includes(validated.type)) {
          const shop = await getShop.shop(req);
          if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
          validated.shop_id = shop.id;
        }

        validated.uuid = uuidv4();
        const category = await Category.create(validated);

        // Handle translations if provided
        if (validated.translations && Array.isArray(validated.translations)) {
          await CategoryTranslationModel.bulkCreate(
            validated.translations.map(t => ({
              translatable_id: category.id,
              translatable_type: 'Category',
              locale: t.locale,
              title: t.title
            }))
          );
        }

        return ApiResponse.successResponse(res, 'Category created successfully', transformCategory(category));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in store: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Show a single category
    async show(req, res) {
      try {
        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const category = await Category.findOne({
          where: { uuid: req.params.uuid },
          include: [
            { model: CategoryTranslationModel, as: 'translations' },
            { model: CategoryMetaTagModel, as: 'metaTags' }
          ]
        });

        if (!category || (category.shop_id && category.shop_id !== shop.id)) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        return ApiResponse.successResponse(res, 'Category retrieved', transformCategory(category));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in show: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Update a category
    async update(req, res) {
      try {
        await Promise.all(validateCategoryCreate.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const category = await Category.findOne({ where: { uuid: req.params.uuid } });
        if (!category || category.shop_id !== shop.id) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        await category.update(req.body);

        // Update translations if provided
        if (req.body.translations && Array.isArray(req.body.translations)) {
          await CategoryTranslationModel.destroy({ where: { translatable_id: category.id, translatable_type: 'Category' } });
          await CategoryTranslationModel.bulkCreate(
            req.body.translations.map(t => ({
              translatable_id: category.id,
              translatable_type: 'Category',
              locale: t.locale,
              title: t.title
            }))
          );
        }

        return ApiResponse.successResponse(res, 'Category updated successfully', transformCategory(category));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in update: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Delete category image
    async imageDelete(req, res) {
      try {
        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const category = await Category.findOne({ where: { uuid: req.params.uuid } });
        if (!category || category.shop_id !== shop.id) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        // Assuming galleries are stored in a separate table (CategoryGallery)
        await sequelize.models.CategoryGallery.destroy({ where: { path: category.img } });
        await category.update({ img: null });

        return ApiResponse.successResponse(res, 'Category image deleted successfully', transformCategory(category));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in imageDelete: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Search categories
    async categoriesSearch(req, res) {
      try {
        await Promise.all(validateCategoryFilter.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const filter = { ...req.query, shop_id: shop.id };
        const categories = await Category.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${filter.search || ''}%` } },
              { '$translations.title$': { [Op.iLike]: `%${filter.search || ''}%` } }
            ],
            shop_id: shop.id
          },
          include: [{ model: CategoryTranslationModel, as: 'translations' }]
        });

        return ApiResponse.successResponse(res, 'Categories searched', categories.map(transformCategory));
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in categoriesSearch: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Export categories to Excel
    async fileExport(req, res) {
      try {
        await Promise.all(validateFilterParams.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const filter = { ...req.query, shop_id: shop.id };
        const categories = await Category.findAll({
          where: filter,
          include: [{ model: CategoryTranslationModel, as: 'translations' }]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Categories');
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'UUID', key: 'uuid', width: 36 },
          { header: 'Title', key: 'title', width: 30 },
          { header: 'Active', key: 'active', width: 10 }
        ];

        categories.forEach(category => {
          const translation = category.translations.find(t => t.locale === (req.query.lang || 'en')) || category.translations[0];
          worksheet.addRow({
            id: category.id,
            uuid: category.uuid,
            title: translation?.title || '',
            active: category.active ? 'Yes' : 'No'
          });
        });

        const fileName = `export/categories_${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, '..', 'public', fileName);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await workbook.xlsx.writeFile(filePath);

        return ApiResponse.successResponse(res, 'Successfully exported', {
          path: 'public/export',
          file_name: fileName
        });
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in fileExport: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Import categories from Excel
    async fileImport(req, res) {
      try {
        if (!req.file) {
          return ApiResponse.errorResponse(res, 'ERR422', 'File is required', 422);
        }

        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);

        const categories = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header
          categories.push({
            uuid: uuidv4(),
            shop_id: shop.id,
            title: row.getCell(3).value,
            active: row.getCell(4).value === 'Yes',
            translations: [{
              locale: req.query.lang || 'en',
              title: row.getCell(3).value
            }]
          });
        });

        for (const category of categories) {
          const createdCategory = await Category.create(category);
          await CategoryTranslationModel.bulkCreate(
            category.translations.map(t => ({
              translatable_id: createdCategory.id,
              translatable_type: 'Category',
              locale: t.locale,
              title: t.title
            }))
          );
        }

        return ApiResponse.successResponse(res, 'Successfully imported');
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in fileImport: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR508', `Import failed: ${error.message}`, 500);
      }
    },

    // Change category active status
    async changeActive(req, res) {
      try {
        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const category = await Category.findOne({ where: { uuid: req.params.uuid } });
        if (!category || category.shop_id !== shop.id) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        await category.update({ active: !category.active });
        return ApiResponse.successResponse(res, 'Category status updated');
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in changeActive: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    // Delete categories
    async destroy(req, res) {
      try {
        await Promise.all(validateFilterParams.map(validator => validator.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return ApiResponse.errorResponse(res, 'ERR422', errors.array().map(e => e.msg).join(', '), 422);
        }

        const shop = await getShop.shop(req);
        if (!shop) return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);

        const ids = req.body.ids || [];
        const categories = await Category.findAll({
          where: { uuid: { [Op.in]: ids }, shop_id: shop.id }
        });

        // Check for children or products (simplified, adjust based on actual logic)
        for (const category of categories) {
          const hasChildren = await Category.count({ where: { parent_id: category.id } });
          const hasProducts = await sequelize.models.Product.count({ where: { category_id: category.id } });
          if (hasChildren || hasProducts) {
            return ApiResponse.errorResponse(res, 'ERR504', 'Cannot delete category with children or products', 400);
          }
        }

        await Category.destroy({ where: { uuid: { [Op.in]: ids }, shop_id: shop.id } });
        return ApiResponse.successResponse(res, 'Categories deleted successfully', []);
      } catch (error) {
        Loggable.error(new Error(`[CategoryController] Error in destroy: ${error.message}`));
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    }
  };
};

module.exports = CategoryController;