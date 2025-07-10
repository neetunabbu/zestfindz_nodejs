// D:\zestfindz_nodejs\src\requests\GalleryUploadRequest.js

const { body } = require('express-validator');

// Replace this with your actual Gallery types (Laravel's Gallery::TYPES)
const GALLERY_TYPES = ['type1', 'type2', 'type3']; // Example: ['banner', 'thumbnail', 'cover']

const GalleryUploadRequest = [
  body('image')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Image file is required');
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

module.exports = GalleryUploadRequest;
