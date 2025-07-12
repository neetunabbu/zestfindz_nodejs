// D:\zestfindz_nodejs\src\requests\GalleryMultiUploadRequest.js

const { body } = require('express-validator');

// Replace this with your actual Gallery TYPES array
const GALLERY_TYPES = ['type1', 'type2', 'type3']; // <- replace with actual Gallery::TYPES values

const GalleryMultiUploadRequest = [
  body('images')
    .exists({ checkFalsy: true })
    .withMessage('images field is required')
    .isArray()
    .withMessage('images must be an array'),

  body('images.*')
    .custom((value, { req }) => {
      if (!req.files || !Array.isArray(req.files.images)) {
        throw new Error('Each image must be a valid file');
      }
      return true;
    }),

  body('type')
    .exists({ checkFalsy: true })
    .withMessage('type is required')
    .isString()
    .withMessage('type must be a string')
    .isIn(GALLERY_TYPES)
    .withMessage(`type must be one of: ${GALLERY_TYPES.join(', ')}`)
];

module.exports = GalleryMultiUploadRequest;
