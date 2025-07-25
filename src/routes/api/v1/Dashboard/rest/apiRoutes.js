const express = require('express');
const router = express.Router();
const sequelize = require('../../../../../config/db');

const CategoryController = require('../../../../../controllers/Api/v1/dashboard/rest/categoryController');
const BrandController = require('../../../../../controllers/Api/v1/dashboard/rest/brandController');

const categoryController = CategoryController(sequelize);
const brandController = BrandController(sequelize);

const authMiddleware = (req, res, next) => {
  req.userId = 1; 
  next();
};

// -------- Rest Category Routes --------
router.get('/rest/categories/types', categoryController.types);
router.get('/rest/categories/parent',  categoryController.parentCategory);
router.get('/rest/categories/children/:id', authMiddleware, categoryController.childrenCategory);
router.get('/rest/categories/paginate', authMiddleware, categoryController.paginate);
router.get('/rest/categories/select-paginate', authMiddleware, categoryController.selectPaginate);
router.get('/rest/categories/search', authMiddleware, categoryController.categoriesSearch);
router.get('/rest/categories/:uuid',authMiddleware, categoryController.show);
router.get('/rest/categories/slug/:slug',authMiddleware, categoryController.showSlug);

// -------- Rest Brand Routes --------
router.get('/rest/brands/paginate', authMiddleware, brandController.paginate);
router.get('/rest/brands/:id', authMiddleware, brandController.show);
router.get('/rest/brands/slug/:slug', authMiddleware, brandController.showSlug);

module.exports = router;
