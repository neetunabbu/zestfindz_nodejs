const { Sequelize } = require('sequelize');
const LoggableMixin = require('./loggableMixin');

// Helper for order report operations
const OrderReportHelper = (sequelize) => {
  const OrderModel = sequelize.models.Order;

  return {
    // Generate raw SQL expressions for counting orders by status
    rawPricesByOrderStatuses() {
      LoggableMixin.error(new Error('[OrderReportHelper] rawPricesByOrderStatuses called'));

      try {
        // Assume OrderModel.STATUSES is an array of status strings
        const statuses = OrderModel.STATUSES || ['new', 'processing', 'completed']; // Adjust based on actual STATUSES

        const raw = statuses.map(status => ({
          [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = '${status}' THEN 1 ELSE 0 END`))]: `total_${status}_count`
        }));

        return raw;
      } catch (error) {
        LoggableMixin.error(new Error(`[OrderReportHelper] Error in rawPricesByOrderStatuses: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = OrderReportHelper;