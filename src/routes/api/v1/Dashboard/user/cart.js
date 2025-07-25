const express = require('express');
const router = express.Router();

const CartController = require('../../../../../controllers/Api/v1/dashboard/user/CartController');
const auth = require('../../../../../middleware/verifyToken');

// Requests
const storeRequest = require('../../../../../requests/Cart/StoreRequest');
const insertProductsRequest = require('../../../../../requests/Cart/InsertProductsRequest');
const openCartRequest = require('../../../../../requests/Cart/OpenCartRequest');
const cartCalculateRequest = require('../../../../../requests/cart/CalculateRequest');
const FilterParamsRequest = require('../../../../../requests/cart/FilterParamsRequest');

router.post('/cart', auth, storeRequest, CartController.store);
router.post('/cart/insert-product', auth, insertProductsRequest, CartController.insertProducts);
router.post('/cart/open', auth, openCartRequest, CartController.openCart);
router.post('/cart/set-group/:id', auth, CartController.setGroup);
router.delete('/cart/delete', auth, FilterParamsRequest,CartController.deleteCart);
router.delete('/cart/my-delete', auth,FilterParamsRequest, CartController.myDelete);
router.delete('/cart/product/delete', auth, FilterParamsRequest,CartController.cartProductDelete);
router.delete('/cart/member/delete', auth, FilterParamsRequest,CartController.userCartDelete);
router.delete('/cart/detail/delete', auth,FilterParamsRequest, CartController.userCartDetailDelete);
router.get('/cart', auth,FilterParamsRequest, CartController.get);
router.post('/cart/status/:uuid', auth, FilterParamsRequest, CartController.statusChange);
router.post('/cart/calculate/:id', auth, cartCalculateRequest, CartController.cartCalculate);

module.exports = router;
