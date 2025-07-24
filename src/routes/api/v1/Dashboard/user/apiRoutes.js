const express = require('express');
const router = express.Router();
const sequelize = require('../../../../../config/db');
const BlogController = require('../../../../../controllers/Api/v1/dashboard/user/BlogController');
const DigitalFileController = require('../../../../../controllers/Api/v1/dashboard/user/DigitalFileController');
const verifyToken = require('../../../../../middleware/verifyToken');
const upload = require('../../../../../middleware/upload');

// router.post('/user/shops/review/:id', ShopController.addReview);
router.post('/user/blogs/review/:id', BlogController.addReview);

// Digital File routes
router.get('/user/digital-files',  DigitalFileController.index);
router.get('/user/my-digital-files',  DigitalFileController.myDigitalFiles);
router.get('/user/digital-files/:id',  DigitalFileController.getDigitalFile);
router.post('/user/digital-files',  upload.single('file'), DigitalFileController.uploadFile);



module.exports = router;
