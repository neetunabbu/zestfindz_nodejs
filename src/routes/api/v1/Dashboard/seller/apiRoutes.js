const express = require('express');
const router = express.Router();
const CategoryController = require('../../../../../controllers/Api/v1/dashboard/seller/categoryController');
const sequelize = require('../../../../../config/db');
const upload = require('../../../../../helpers/ImageUpload');


const authMiddleware = (req, res, next) => {
  req.userId = 1;
  next();
};

// ✅ This works ONLY if controller is a function
const categoryController = CategoryController(sequelize);

// Routes
router.get('/categories', categoryController.index);
router.post('/categories', authMiddleware, upload.single('image'), categoryController.store);
router.put('/categories/:uuid', authMiddleware, upload.single('image'), categoryController.update);
router.delete('/categories/:uuid', authMiddleware, categoryController.destroy);


module.exports = router;
