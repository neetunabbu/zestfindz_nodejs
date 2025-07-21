const { body } = require('express-validator');
const { User, Order, Ticket } = require('../../models'); // Sequelize models

const StoreRequest = [
  // ✅ created_by is required and must exist in users table
  body('created_by')
    .notEmpty().withMessage('created_by is required')
    .isInt().withMessage('created_by must be an integer')
    .custom(async (value) => {
      const exists = await User.findByPk(value);
      if (!exists) {
        return Promise.reject('created_by user does not exist');
      }
    }),

  // ✅ user_id is required and must exist
  body('user_id')
    .notEmpty().withMessage('user_id is required')
    .isInt().withMessage('user_id must be an integer')
    .custom(async (value) => {
      const exists = await User.findByPk(value);
      if (!exists) {
        return Promise.reject('user_id user does not exist');
      }
    }),

  // ✅ order_id is required and must exist
  body('order_id')
    .notEmpty().withMessage('order_id is required')
    .isInt().withMessage('order_id must be an integer')
    .custom(async (value) => {
      const exists = await Order.findByPk(value);
      if (!exists) {
        return Promise.reject('order_id does not exist');
      }
    }),

  // ✅ parent_id is optional but must exist if provided
  body('parent_id')
    .optional()
    .isInt().withMessage('parent_id must be an integer')
    .custom(async (value) => {
      const exists = await Ticket.findByPk(value);
      if (!exists) {
        return Promise.reject('parent_id ticket not found');
      }
    }),

  // ✅ type is optional but must be one of allowed values
  body('type')
    .optional()
    .isIn(['question', 'answer']).withMessage('type must be question or answer'),

  // ✅ subject is required string
  body('subject')
    .notEmpty().withMessage('subject is required')
    .isString().withMessage('subject must be a string'),

  // ✅ content is required string
  body('content')
    .notEmpty().withMessage('content is required')
    .isString().withMessage('content must be a string'),

  // ✅ status is optional and must be one of Ticket.STATUS
  body('status')
    .optional()
    .custom((value) => {
      const allowed = Ticket.STATUS || ['open', 'pending', 'resolved', 'closed'];
      if (!allowed.includes(value)) {
        throw new Error(`status must be one of: ${allowed.join(', ')}`);
      }
      return true;
    }),
];

module.exports = StoreRequest;
