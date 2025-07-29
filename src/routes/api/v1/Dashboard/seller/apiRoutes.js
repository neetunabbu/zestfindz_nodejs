const express = require('express');
const router = express.Router();
const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController');
const sequelize = require('../../../../../config/db');
const upload = require('../../../../../helpers/ImageUpload');

const FilterParamsRequest = require('../../../../../requests/FilterParamsRequest');
// const adsPackageController = require('../../../../../controllers/Api/v1/dashboard/seller/AdsPackageController');

// Import BrandController and initialize with sequelize
const BrandController = require('../../../../../controllers/Api/v1/dashboard/seller/brandController');
const brandController = BrandController(sequelize);

const authMiddleware = (req, res, next) => {
  req.userId = 1;
  next();
};

// ✅ This works ONLY if controller is a function
const categoryController = CategoryController(sequelize);

// -------- Seller Category Routes Here --------
router.get('/seller/categories', categoryController.index);
router.post('/seller/categories', authMiddleware, upload.single('image'), categoryController.store);
router.put('/seller/categories/:uuid', authMiddleware, upload.single('image'), categoryController.update);
router.delete('/seller/categories/:uuid', authMiddleware, categoryController.destroy);

// -------- Seller Brand Routes Here --------
router.get('/seller/brands', authMiddleware, brandController.index);
router.get('/seller/brands/paginate', authMiddleware, brandController.paginate);
router.post('/seller/brands', authMiddleware, upload.single('image'), brandController.store);
router.get('/seller/brands/:uuid', authMiddleware, brandController.show);
router.put('/seller/brands/:uuid', authMiddleware, upload.single('image'), brandController.update);
router.patch('/seller/brands/:id/active', authMiddleware, brandController.setActive);
router.delete('/seller/brands', authMiddleware, brandController.destroy);
router.post('/seller/brands/import', authMiddleware, upload.single('file'), brandController.fileImport);
router.get('/seller/brands/export', authMiddleware, brandController.fileExport);


// router.get('/seller/ads-packages', FilterParamsRequest, adsPackageController.index);
// router.get('/:id', findAdsPackageById('AdsPackage'), adsPackageController.show);


module.exports = router;
