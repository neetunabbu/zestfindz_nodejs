const express = require('express');
const router = express.Router();
const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController');
const sequelize = require('../../../../../config/db');
const multer = require('multer');

// Dummy auth middleware
const authMiddleware = (req, res, next) => {
  req.userId = 1;
  next();
};

// ✅ This works ONLY if controller is a function
const categoryController = CategoryController(sequelize);

// Routes
router.get('/categories', categoryController.index);
router.post('/categories', authMiddleware, categoryController.store);
router.put('/categories/:uuid', authMiddleware, categoryController.update);
router.delete('/categories/:uuid', authMiddleware, categoryController.destroy);


module.exports = router;
