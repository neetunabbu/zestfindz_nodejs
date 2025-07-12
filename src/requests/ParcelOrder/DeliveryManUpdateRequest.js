// D:\zestfindz_nodejs\src\requests\ParcelOrder\DeliveryManUpdateRequest.js

const { body } = require('express-validator');

const DeliveryManUpdateRequest = [
  body('deliveryman_id')
    .notEmpty().withMessage('deliveryman_id is required')
    .isInt().withMessage('deliveryman_id must be an integer'),
    // Note: DB check must be done manually after this validation
];

module.exports = DeliveryManUpdateRequest;
