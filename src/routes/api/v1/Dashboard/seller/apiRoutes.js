const express = require('express');
const router = express.Router();
const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController'); // Adjust path as needed
// const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController'); // Adjust path as needed
const { validateCategoryCreate, validateCategoryFilter, validateFilterParams } = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController'); // Adjust path as needed
// const { validateCategoryCreate, validateCategoryFilter, validateFilterParams } = require('../controllers/categoryController');
const multer = require('multer');
const sequelize = require('../../../../../config/db');
// Authentication middleware (example, replace with your actual setup)
// const authMiddleware = (req, res, next) => {
//   req.userId = 1; // Replace with JWT or session-based user ID
//   next();
// };

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize controller with Sequelize instance
const categoryController = CategoryController(sequelize);
// // Category routes
// router.get('/categories/export', authMiddleware, validateFilterParams, categoryController.fileExport);
// router.post('/categories/:uuid/image/delete', authMiddleware, categoryController.imageDelete);
// router.get('/categories/search', authMiddleware, validateCategoryFilter, categoryController.categoriesSearch);
// router.get('/categories/paginate', authMiddleware, validateCategoryFilter, categoryController.paginate);
// router.get('/categories/select-paginate', authMiddleware, validateCategoryFilter, categoryController.selectPaginate);
// router.get('/my-categories/select-paginate', authMiddleware, validateCategoryFilter, categoryController.mySelectPaginate);
// router.post('/categories/import', authMiddleware, upload.single('file'), categoryController.fileImport);

// // apiResource equivalent for categories
router.get('/categories',  categoryController.index); // GET /categories
// router.post('/categories', authMiddleware, validateCategoryCreate, categoryController.store); // POST /categories
// router.get('/categories/:uuid', authMiddleware, categoryController.show); // GET /categories/{uuid}
// router.put('/categories/:uuid', authMiddleware, validateCategoryCreate, categoryController.update); // PUT /categories/{uuid}
// router.delete('/categories/:uuid', authMiddleware, categoryController.destroy); // DELETE /categories/{uuid}
// router.delete('/categories/delete', authMiddleware, validateFilterParams, categoryController.destroy); // DELETE /categories/delete
// router.post('/categories/:uuid/active', authMiddleware, categoryController.changeActive); // POST /categories/{uuid}/active

module.exports = router;