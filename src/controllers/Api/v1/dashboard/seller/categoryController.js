const CategoryController = (sequelize) => {
  const { validationResult, body, query } = require('express-validator');
  const getShop = require('../../../../../helpers/GetShop');
  const Category = sequelize.models.Category;
  const CategoryTranslationModel = sequelize.models.CategoryTranslation;
  const CategoryMetaTagModel = sequelize.models.CategoryMetaTag;
  const { v4: uuidv4 } = require('uuid');
  const ApiResponse = require('../../../../../Traits/ApiResponse');
  const Loggable = require('../../../../../Traits/Loggable');
  const types = ['main', 'sub_main', 'child', 'receipt'];
  const transformCategory = (category) => ({
    id: category.id,
    uuid: category.uuid,
    shop_id: category.shop_id,
    type: category.type,
    img: category.img,
    active: category.active,
    keywords: category.keywords,
    input: category.input,
    slug: category.slug,
    return_window_time: category.return_window_time,
    gst: category.gst,
    translations: category.translations?.map(t => ({
      locale: t.locale,
      title: t.title
    })) || [],
    metaTags: category.metaTags?.map(m => ({
      key: m.key,
      value: m.value
    })) || []
  });

  const validateCategoryFilter = [
    query('type').optional().isIn(['main', 'sub_main', 'child', 'receipt']).withMessage('Invalid type'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('per_page').optional().isInt({ min: 1 }).toInt()
  ];
  return {
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

    async store(req, res) {
      try {
        const { title, locale = 'en', type = 'main', meta_tags = [], keywords, input, slug, return_window_time, gst } = req.body;
        const img = req.file ? req.file.filename : null;
        const shop = await getShop.shop(req);
        if (!shop) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Shop not found', 404);
        }

        // Create the category
        const newCategory = await Category.create({
          uuid: uuidv4(),
          shop_id: shop.id,
          type,
          active: true,
          keywords,
          img, 
          input,
          slug,
          return_window_time,
          gst
        });

        // Add translation
        await CategoryTranslationModel.create({
          category_id: newCategory.id,
          locale,
          title
        });

        // ✅ Add meta tags
        if (Array.isArray(meta_tags) && meta_tags.length > 0) {
          const formattedMetaTags = meta_tags.map(tag => ({
            translatable_id: newCategory.id,
            translatable_type: 'Category',
            key: tag.key,
            value: tag.value
          }));

          await CategoryMetaTagModel.bulkCreate(formattedMetaTags);
        }

        // Fetch full category with translations and metaTags
        const fullCategory = await Category.findByPk(newCategory.id, {
          include: [
            { model: CategoryTranslationModel, as: 'translations' },
            { model: CategoryMetaTagModel, as: 'metaTags' }
          ]
        });

        return ApiResponse.successResponse(res, 'Category created successfully', transformCategory(fullCategory));

      } catch (error) {
        console.error(`[CategoryController] Error in store: ${error.message}`);
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    async update(req, res) {
      try {
        const { uuid } = req.params;
        const {
          title,
          locale = 'en',
          type = 'main',
          meta_tags = [],
          keywords,
          input,
          slug,
          return_window_time,
          gst
        } = req.body;

        if (req.file) {
          category.img = req.file.filename;
        }
        // Step 1: Find the category by UUID
        const category = await Category.findOne({ where: { uuid } });
        if (!category) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        category.type = type;
        category.keywords = keywords;
        category.input = input;
        category.slug = slug;
        category.return_window_time = return_window_time;
        category.gst = gst;
        await category.save();

        const translation = await CategoryTranslationModel.findOne({
          where: { category_id: category.id, locale }
        });

        if (translation) {
          translation.title = title;
          await translation.save();
        } else {
          await CategoryTranslationModel.create({
            category_id: category.id,
            locale,
            title
          });
        }

        if (Array.isArray(meta_tags)) {
          await CategoryMetaTagModel.destroy({
            where: {
              translatable_id: category.id,
              translatable_type: 'Category'
            }
          });

          const formattedMetaTags = meta_tags.map(tag => ({
            translatable_id: category.id,
            translatable_type: 'Category',
            key: tag.key,
            value: tag.value
          }));

          await CategoryMetaTagModel.bulkCreate(formattedMetaTags);
        }

        const updatedCategory = await Category.findByPk(category.id, {
          include: [
            { model: CategoryTranslationModel, as: 'translations' },
            { model: CategoryMetaTagModel, as: 'metaTags' }
          ]
        });

        return ApiResponse.successResponse(res, 'Category updated successfully', transformCategory(updatedCategory));
      } catch (error) {
        console.error(`[CategoryController] Error in update: ${error.message}`);
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    },

    async destroy(req, res) {
      try {
        const { uuid } = req.params;

        // Step 1: Find the category by UUID
        const category = await Category.findOne({ where: { uuid } });
        if (!category) {
          return ApiResponse.errorResponse(res, 'ERR404', 'Category not found', 404);
        }

        // Step 2: Delete translations
        await CategoryTranslationModel.destroy({
          where: { category_id: category.id }
        });

        // Step 3: Delete meta tags (polymorphic)
        await CategoryMetaTagModel.destroy({
          where: {
            translatable_id: category.id,
            translatable_type: 'Category'
          }
        });

        // Step 4: Delete the main category
        await category.destroy();

        return ApiResponse.successResponse(res, 'Category deleted successfully');
      } catch (error) {
        console.error(`[CategoryController] Error in destroy: ${error.message}`);
        return ApiResponse.errorResponse(res, 'ERR500', error.message, 500);
      }
    }

  };
};

module.exports = CategoryController;
