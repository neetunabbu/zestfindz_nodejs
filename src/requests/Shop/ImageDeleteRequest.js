// D:\zestfindz_nodejs\src\requests\Shop\ImageDeleteRequest.js

const { body } = require('express-validator');

const ImageDeleteRequest = [
  // ✅ 'tag' is required and must be either 'background' or 'logo'
  body('tag')
    .exists({ checkFalsy: true }).withMessage('tag is required')
    .isIn(['background', 'logo']).withMessage('tag must be either "background" or "logo"'),
];

module.exports = ImageDeleteRequest;
