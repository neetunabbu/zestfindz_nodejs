const CartService = require('../../../../../services/CartService/CartService');
const ResponseError = require('../../../../../helpers/ResponseError');
// const CartResource = require('../../../../../resources/cart/CartResource');
const { Currency } = require('../../../../../models');
const ApiResponse = require('../../../../../Traits/ApiResponse');

const get = async (req, res) => {
  try {
    const result = await CartService.successReturn(req.user.id, req.language);
    if (!result) return ApiResponse.errorResponse(res, ResponseError.ERROR_404, 'Cart not found');
    return ApiResponse.successResponse(res, result, ResponseError.NO_ERROR);
  } catch (error) {
    return ApiResponse.errorResponse(res, ResponseError.SERVER_ERROR, error.message);
  }
};

const store = async (req, res) => {
  try {
    const rateObj = await Currency.findByPk(req.body.currency_id);
    req.body.rate = rateObj?.rate || 1;

    const result = await CartService.create(req.user.id, req.body, req.language);
    return ApiResponse.successResponse(res, result, ResponseError.RECORD_WAS_SUCCESSFULLY_CREATED);
  } catch (error) {
    return ApiResponse.errorResponse(res, ResponseError.SERVER_ERROR, error.message);
  }
};

const myDelete = async (req, res) => {
  try {
    const result = await CartService.deleteUserCart(req.user.id);
    return ApiResponse.successResponse(res, result, ResponseError.RECORD_WAS_SUCCESSFULLY_DELETED);
  } catch (error) {
    return ApiResponse.errorResponse(res, ResponseError.SERVER_ERROR, error.message);
  }
};

const applyBonus = async (req, res) => {
  try {
    const result = await CartService.bonus(req.user.id, req.body.bonus_id, req.language);
    return ApiResponse.successResponse(res, result, ResponseError.NO_ERROR);
  } catch (error) {
    return ApiResponse.errorResponse(res, ResponseError.SERVER_ERROR, error.message);
  }
};

// const checkBonus = async (req, res) => {
//   try {
//     const result = await CartService.checkBonus(req.user.id, req.language);
//     return ApiResponse.successResponse(res, result, ResponseError.NO_ERROR);
//   } catch (error) {
//     return ApiResponse.errorResponse(res, ResponseError.SERVER_ERROR, error.message);
//   }
// };

module.exports = {
  get,
  store,
  myDelete,
  applyBonus,
//   checkBonus,
};
