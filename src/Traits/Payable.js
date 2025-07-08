const { DataTypes } = require('sequelize');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Transaction status constants (replace with actual values from your Transaction model)
const TRANSACTION_STATUS = {
  PROGRESS: 'progress',
  CANCELED: 'canceled'
};

// Mixin to define the Payable polymorphic relationships and transaction creation
const Payable = (sequelize) => {
  return {
    // Define the morphMany and morphOne relationships with Transaction model
    defineRelationships: (Model, TransactionModel) => {
      // MorphMany: transactions
      Model.hasMany(TransactionModel, {
        foreignKey: {
          name: 'payable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          payable_type: Model.name
        },
        as: 'transactions'
      });

      // MorphOne: transaction
      Model.hasOne(TransactionModel, {
        foreignKey: {
          name: 'payable_id',
          type: DataTypes.BIGINT, // Matches assumed model ID type
          allowNull: false
        },
        constraints: false,
        scope: {
          payable_type: Model.name
        },
        as: 'transaction'
      });
    },

    // Create or update a transaction
    createTransaction: async (instance, data, userId = null) => {
      const TransactionModel = sequelize.models.Transaction;

      const status = dataGet(data, 'status', TRANSACTION_STATUS.PROGRESS);

      const transactionData = {
        price: dataGet(data, 'price'),
        user_id: dataGet(data, 'user_id', userId), // userId from auth middleware
        payment_sys_id: dataGet(data, 'payment_sys_id'),
        payment_trx_id: dataGet(data, 'payment_trx_id'),
        note: dataGet(data, 'note', ''),
        perform_time: dataGet(data, 'perform_time', new Date()),
        status_description: dataGet(data, 'status_description', 'Transaction in progress'),
        status,
        payable_id: instance.id,
        payable_type: instance.constructor.name
      };

      if (status === TRANSACTION_STATUS.CANCELED) {
        transactionData.refund_time = new Date();
      }

      // Use Sequelize's upsert (updateOrCreate equivalent)
      const [transaction] = await TransactionModel.upsert(transactionData, {
        returning: true,
        conflictFields: ['payable_id', 'payable_type']
      });

      return transaction;
    }
  };
};

module.exports = Payable;