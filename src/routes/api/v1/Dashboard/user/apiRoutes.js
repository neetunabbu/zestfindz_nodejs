const express = require('express');
const router = express.Router();
const sequelize = require('../../../../../config/db');
const BlogController = require('../../../../../controllers/Api/v1/dashboard/user/BlogController');
const ShopController = require('../../../../../controllers/Api/v1/dashboard/user/ShopController');
const DigitalFileController = require('../../../../../controllers/Api/v1/dashboard/user/DigitalFileController');
const verifyToken = require('../../../../../middleware/verifyToken');
const upload = require('../../../../../middleware/upload');
const UserProfileController = require('../../../../../controllers/Api/v1/dashboard/user/UserProfileController');
// const RequestModelController = require('../../../../../controllers/Api/v1/dashboard/user/RequestModelController');
const  UserAddressController  = require('../../../../../controllers/Api/v1/dashboard/user/UserAddressController');
const ProfileController = require('../../../../../controllers/Api/v1/dashboard/user/ProfileController');
const UserActivityController = require('../../../../../controllers/Api/v1/dashboard/user/UserActivityController');
const ProductController = require('../../../../../controllers/Api/v1/dashboard/user/ProductController');
const AddReviewRequest = require('../../../../../requests/Order/AddReviewRequest');

function authMiddleware(req, res, next) {
  req.user = { id: 1 };
  next();
}

//  UserProfile Routes Here
router.get('/user/userprofile', UserProfileController.index);
router.post('/user/userprofile', UserProfileController.store);
router.put('/user/userprofile/:id', UserProfileController.update);
router.delete('/user/userprofile/:id', UserProfileController.destroy);
// profile Routes Here
router.post('/user/profile',authMiddleware, ProfileController.store);
router.get('/user/profile',authMiddleware, ProfileController.show);
router.put('/user/profile/:id',authMiddleware, ProfileController.update);
router.delete('/user/profile/:id',authMiddleware, ProfileController.remove);
//  User Activities Routes here
router.get('/user/user-activities', authMiddleware, UserActivityController.index)
router.post('/user/user-activities',authMiddleware, UserActivityController.storeMany)
// Review Routes Here
router.post('/user/shops/review/:id', ShopController.addReviews);
router.post('/user/blogs/review/:id', BlogController.addReviews);
// Product Reviews Routes
router.post('/user/products/review/:uuid',authMiddleware , AddReviewRequest(), ProductController.addProductReview);
router.get('/user/products/review/:uuid', ProductController.getProductReviews);
// Digital File Routes Here
// router.get('/user/digital-files',  DigitalFileController.index);
// router.get('/user/my-digital-files',  DigitalFileController.myDigitalFiles);
// router.get('/user/digital-files/:id',  DigitalFileController.getDigitalFile);
// router.post('/user/digital-files',  upload.single('file'), DigitalFileController.uploadFile);
// Request Model Routes Here
// router.get('/user/request-models', RequestModelController.index);
// router.post('/user/request-models', RequestModelController.store);
// router.get('/user/request-models/:id', RequestModelController.show);
// router.put('/user/request-models/:id', RequestModelController.update);
// router.delete('/user/request-models/:id', RequestModelController.destroy);
// Tickets Routes Here
// router.get('/user/tickets/paginate', ticketController.paginate);
// router.post('/user/tickets', ticketController.store);
// router.get('/user/tickets/:id', ticketController.show);
// router.put('/user/tickets/:id', ticketController.update);

// UserAddressController Routes Here
router.get('/user/address', UserAddressController.index);
router.post('/user/address', UserAddressController.store);
router.put('/user/address/:id', UserAddressController.update);
router.delete('/user/address', authMiddleware, UserAddressController.destroy);
router.put('/user/address/active/:id',authMiddleware, UserAddressController.setActive);
router.get('/user/address/active',authMiddleware, UserAddressController.getActive);
router.get('/user/address/:id', UserAddressController.show);

// router.use('/user', cartRoutes);

module.exports = router;
