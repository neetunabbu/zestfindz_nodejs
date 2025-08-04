const express = require('express');
const router = express.Router();
const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController');
const BrandController = require('../../../../../controllers/Api/v1/dashboard/seller/brandController');
const TagController = require('../../../../../controllers/API/v1/Dashboard/Seller/TagController'); // ✅ NEW
const UnitController = require('../../../../../controllers/API/v1/Dashboard/Seller/UnitController');
const sequelize = require('../../../../../config/db');
const upload = require('../../../../../helpers/ImageUpload');

const FilterParamsRequest = require('../../../../../requests/FilterParamsRequest');
// const adsPackageController = require('../../../../../controllers/Api/v1/dashboard/seller/AdsPackageController');

const brandController = BrandController(sequelize);
const categoryController = CategoryController(sequelize);
const tagController = TagController; // ✅ NEW
const unitController = UnitController; 
// const tagController = TagController(sequelize); 
// const tagController = require('../../../../../controllers/API/v1/Dashboard/Seller/TagController');

const authMiddleware = (req, res, next) => {
  req.userId = 1;
  req.shop = { id: 1 }; // ✅ FAKE shop object for testing
  req.repositories = {
    tagRepository: {
      paginate: async (params) => {
        return [
          { id: 1, name: 'Sample Tag 1' },
          { id: 2, name: 'Sample Tag 2' }
        ];
      },
      show: async (tag) => tag
    },
    shopTagRepository: {
      paginate: async (query) => {
        return [
          { id: 1, name: 'Shop Tag 1' },
          { id: 2, name: 'Shop Tag 2' }
        ];
      }
    }
  };
  req.services = {
    tagService: {
      create: async (data) => ({ status: true }),
      update: async (tag, data) => ({ status: true }),
      delete: async (ids, shopId) => true
    }
  };
  req.language = 'en';
  req.tag = { id: 1, name: 'Tag A' }; // dummy tag
  global.__ = (msg) => msg;
  global.successResponse = (res, msg, data) => res.json({ message: msg, data });
  global.onErrorResponse = (res, result) => res.status(500).json({ error: result.message || "Unknown error" });
  next();
};

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

// -------- Seller Tag Routes Here -------- ✅ NEW
router.get('/seller/tags', authMiddleware, tagController.index);
router.post('/seller/tags', authMiddleware, tagController.store);
router.get('/seller/tags/:id', authMiddleware, tagController.show);
router.put('/seller/tags/:id', authMiddleware, tagController.update);
router.delete('/seller/tags/delete', authMiddleware, tagController.destroy);
router.get('/seller/shop-tags/paginate', authMiddleware, tagController.shopTagsPaginate);

// -------- Seller Unit Routes -------- ✅ NEW
router.get('/seller/units', authMiddleware, unitController.paginate);
router.get('/seller/units/:id', authMiddleware, unitController.show);


router.get('/units', UnitController.paginate);

// router.get('/seller/ads-packages', FilterParamsRequest, adsPackageController.index);
// router.get('/seller/ads-packages',  adsPackageController.index);
// router.get('/:id', findAdsPackageById('AdsPackage'), adsPackageController.show);


module.exports = router;
