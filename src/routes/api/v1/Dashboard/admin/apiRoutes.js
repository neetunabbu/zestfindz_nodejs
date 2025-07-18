const express = require('express');
const router = express.Router();
const sequelize = require('../../../../../config/db');
const upload = require('../../../../../helpers/ImageUpload');

// const CategoryController = require('../../../../controllers/Api/v1/dashboard/admin/categoryController');
const BrandController = require('../../../../../controllers/Api/v1/dashboard/admin/brandController');

// const categoryController = CategoryController(sequelize);
const brandController = BrandController(sequelize);

const authMiddleware = (req, res, next) => {
  req.userId = 1; // Mocked user/admin ID for demo — replace with real auth
  next();
};

// -------- Admin Category Routes --------
// router.get('/admin/categories', categoryController.index);
// router.post('/admin/categories', authMiddleware, upload.single('image'), categoryController.store);
// router.put('/admin/categories/:uuid', authMiddleware, upload.single('image'), categoryController.update);
// router.delete('/admin/categories/:uuid', authMiddleware, categoryController.destroy);

// -------- Admin Brand Routes --------
router.get('/admin/brands/export', authMiddleware, brandController.fileExport);
router.post('/admin/brands/import', authMiddleware, upload.single('file'), brandController.fileImport);
router.get('/admin/brands/paginate', authMiddleware, brandController.paginate);
router.get('/admin/brands/search', authMiddleware, brandController.brandsSearch);
router.get('/admin/brands', authMiddleware, brandController.index);
router.post('/admin/brands', authMiddleware, upload.single('image'), brandController.store);
router.get('/admin/brands/:uuid', authMiddleware, brandController.show);
router.put('/admin/brands/:uuid', authMiddleware, upload.single('image'), brandController.update);
router.delete('/admin/brands/:uuid', authMiddleware, brandController.destroy); 
router.delete('/admin/brands/delete', authMiddleware, brandController.destroy);
router.get('/admin/brands/drop/all', authMiddleware, brandController.dropAll);
router.patch('/admin/brands/:id/active', authMiddleware, brandController.setActive);

module.exports = router;
