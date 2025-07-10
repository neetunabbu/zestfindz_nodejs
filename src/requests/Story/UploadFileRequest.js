const { body } = require('express-validator');

const UploadFileRequest = [
  body('files')
    .exists({ checkNull: true }).withMessage('files field is required')
    .isArray().withMessage('files must be an array'),

  body('files.*')
    .exists({ checkFalsy: true }).withMessage('Each file is required')
    .isLength({ min: 1 }).withMessage('Each file must be at least 1 byte')
    .isLength({ max: 20000 }).withMessage('Each file must be at most 20000 bytes'),
];

module.exports = UploadFileRequest;
