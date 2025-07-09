// D:\zestfindz_nodejs\src\requests\DeliveryPointClosedDate\StoreRequest.js

const { body } = require('express-validator');

const DeliveryPointClosedDateStoreRequest = [
  body('delivery_point_id')
    .exists().withMessage('delivery_point_id is required')
    .isInt().withMessage('delivery_point_id must be an integer'),
    // Note: You can add a custom DB existence check here if needed

  body('dates')
    .optional()
    .isArray().withMessage('dates must be an array'),

  body('dates.*')
    .optional()
    .isISO8601({ strict: true }).withMessage('Each date must be in YYYY-MM-DD format'),
];

module.exports = DeliveryPointClosedDateStoreRequest;
