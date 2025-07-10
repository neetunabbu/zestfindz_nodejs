const LoggableMixin = require('./loggableMixin');

// Utility function to calculate distance (mimics Laravel's Utility::getDistance)
const getDistance = (location1, location2) => {
  // Example: Haversine formula for distance between two coordinates
  // Replace with your actual distance calculation logic
  if (!location1 || !location2 || !location1.latitude || !location1.longitude || !location2.latitude || !location2.longitude) {
    return 0; // Fallback if coordinates are missing
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(location2.latitude - location1.latitude);
  const dLon = toRad(location2.longitude - location1.longitude);
  const lat1 = toRad(location1.latitude);
  const lat2 = toRad(location2.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2)); // Return distance in km, rounded to 2 decimals
};

// Helper for generating notification data
const NotificationHelper = (sequelize) => {
  return {
    // Generate notification data for an order
    async order(order, user, language = null) {
      LoggableMixin.error(new Error(`[Notification] order called: order_id=${order.id}, user_id=${user.id}, language=${language || 'default'}`));

      const OrderModel = sequelize.models.Order;
      const ShopModel = sequelize.models.Shop;
      const ShopTranslationModel = sequelize.models.ShopTranslation;
      const UserModel = sequelize.models.User;
      const TransactionModel = sequelize.models.Transaction;
      const PaymentModel = sequelize.models.Payment;

      try {
        // Fetch order with related data
        const loadedOrder = await OrderModel.findByPk(order.id, {
          include: [
            {
              model: ShopModel,
              as: 'shop',
              attributes: ['id', 'uuid', 'logo_img'],
              include: [
                {
                  model: ShopTranslationModel,
                  as: 'translations',
                  where: language ? { locale: language } : undefined,
                  required: false
                }
              ]
            },
            {
              model: UserModel,
              as: 'user',
              attributes: ['id', 'uuid', 'firstname', 'lastname', 'active']
            },
            {
              model: TransactionModel,
              as: 'transaction',
              include: [
                {
                  model: PaymentModel,
                  as: 'paymentSystem'
                }
              ]
            }
          ]
        });

        if (!loadedOrder) {
          LoggableMixin.error(new Error(`[Notification] Order not found: order_id=${order.id}`));
          return null;
        }

        // Fetch user’s delivery location
        const deliveryManSetting = await user.getDeliveryManSetting();

        // Calculate distance
        const distance = getDistance(loadedOrder.location, deliveryManSetting?.location);

        return {
          km: distance,
          second: 30,
          order: loadedOrder
        };
      } catch (error) {
        LoggableMixin.error(new Error(`[Notification] Error in order: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = NotificationHelper;