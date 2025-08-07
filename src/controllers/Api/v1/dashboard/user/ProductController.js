const ProductReviewService = require('../../../../../services/ProductService/ProductReviewService');
const { validationResult } = require('express-validator');

const addProductReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const uuid = req.params.uuid;
    const data = req.body;
    const user = req.user; 
    // console.log('Got UUID:', req.params.uuid);
    const result = await ProductReviewService.addReview(uuid, data, user);
    if (!result.status) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Review added successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await ProductReviewService.getProductReviews(uuid);
    if (!result.status) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Reviews fetched successfully',
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};
module.exports = {
  addProductReview,
  getProductReviews,
};
