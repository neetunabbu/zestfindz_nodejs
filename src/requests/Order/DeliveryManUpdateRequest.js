const { body } = require('express-validator');
const db = require('../../models'); // Adjust the path to your Sequelize models

const DeliveryManUpdateRequest = () => {
  return [
    body('deliveryman_id')
      .exists().withMessage('deliveryman_id is required')
      .bail()
      .isInt().withMessage('deliveryman_id must be an integer')
      .bail()
      .custom(async (value) => {
        const user = await db.User.findByPk(value);
        if (!user) {
          throw new Error('deliveryman_id does not exist in users table');
        }
      }),
  ];
};

module.exports = DeliveryManUpdateRequest;
