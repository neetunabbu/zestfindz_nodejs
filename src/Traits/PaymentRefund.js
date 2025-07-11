const { DataTypes } = require('sequelize');
const axios = require('axios');
const LoggableMixin = require('./loggableMixin');
const Stripe = require('stripe');
const Razorpay = require('razorpay');
const Maksekeskus = require('maksekeskus'); // Hypothetical, replace with actual library
const Iyzipay = require('iyzipay'); // Hypothetical, replace with actual library

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

// Payment system tags (replace with actual values from your Payment model)
const PAYMENT_TAGS = {
  STRIPE: 'stripe',
  FLUTTER_WAVE: 'flutterwave',
  PAY_STACK: 'paystack',
  RAZOR_PAY: 'razorpay',
  MOYA_SAR: 'moyasar',
  MOLLIE: 'mollie',
  MAKSEKESKUS: 'maksekeskus',
  IYZICO: 'iyzico',
  PAY_TABS: 'paytabs',
  PAY_PAL: 'paypal'
};

// Transaction status (replace with actual values from your Transaction model)
const TRANSACTION_STATUS = {
  PROGRESS: 'progress',
  REFUND: 'refund'
};

// Mixin for payment refund functionality
const PaymentRefund = (sequelize) => {
  return {
    // Process refund based on payment system
    async paymentRefund(model) {
      const paymentSystemTag = dataGet(model, 'transaction.paymentSystem.tag');
      LoggableMixin.error(new Error(`[PaymentRefund] paymentRefund called: model=${model?.constructor?.name}, payment_system=${paymentSystemTag}`));

      try {
        switch (paymentSystemTag) {
          case PAYMENT_TAGS.STRIPE:
            await this.stripeRefund(model);
            break;
          case PAYMENT_TAGS.FLUTTER_WAVE:
            await this.flutterWaveRefund(model);
            break;
          case PAYMENT_TAGS.PAY_STACK:
            await this.payStackRefund(model);
            break;
          case PAYMENT_TAGS.RAZOR_PAY:
            await this.razorPayRefund(model);
            break;
          case PAYMENT_TAGS.MOYA_SAR:
            await this.moyasarRefund(model);
            break;
          case PAYMENT_TAGS.MOLLIE:
            await this.mollieRefund(model);
            break;
          case PAYMENT_TAGS.MAKSEKESKUS:
            await this.maksekeskusRefund(model);
            break;
          case PAYMENT_TAGS.IYZICO:
            await this.iyzicoRefund(model);
            break;
          case PAYMENT_TAGS.PAY_TABS:
            await this.paytabsRefund(model);
            break;
          case PAYMENT_TAGS.PAY_PAL:
            await this.paypalRefund(model);
            break;
          default:
            throw new Error(`Unsupported payment system: ${paymentSystemTag}`);
        }
      } catch (error) {
        LoggableMixin.error(new Error(`[PaymentRefund] Error in paymentRefund: ${error.message}`));
        throw error;
      }
    },

    // Stripe refund
    async stripeRefund(model) {
      const modelData = await this.getModelData(model);
      const stripe = new Stripe(dataGet(modelData, 'payload.stripe_sk'));

      const response = await stripe.refunds.create({
        payment_intent: modelData.transactionId,
        amount: Math.round(modelData.price * 100) // Stripe expects amount in cents
      });

      if (response.status === 'succeeded') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Flutterwave refund
    async flutterWaveRefund(model) {
      const modelData = await this.getModelData(model);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataGet(modelData, 'payload.flw_sk')}`
      };

      const response = await axios.post(
        `https://api.flutterwave.com/v3/transactions/${modelData.transactionId}/refund`,
        { amount: modelData.price },
        { headers }
      );

      if (response.status === 200 && response.data.data.status === 'completed') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Paystack refund
    async payStackRefund(model) {
      const modelData = await this.getModelData(model);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataGet(modelData, 'payload.flw_sk')}` // Note: Paystack typically uses 'sk_'
      };

      const response = await axios.post(
        'https://api.paystack.co/refund',
        {
          amount: modelData.price,
          transaction: modelData.transactionId
        },
        { headers }
      );

      if (response.status === 200) {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.PROGRESS }, // Paystack sets to progress initially
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Razorpay refund
    async razorPayRefund(model) {
      const modelData = await this.getModelData(model);
      const razorpayKey = dataGet(modelData, 'payload.razorpay_key');
      const razorpaySecret = dataGet(modelData, 'payload.razorpay_secret');
      const api = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret });

      LoggableMixin.error(new Error(`[PaymentRefund] Razorpay refund initiated: transaction_id=${modelData.transactionId}, amount=${modelData.price}, model_id=${model.id}`));

      const response = await api.payments.refund(modelData.transactionId, {
        amount: modelData.price * 100, // Razorpay expects amount in paisa
        speed: 'normal',
        notes: {
          notes_key_1: 'Refund',
          notes_key_2: 'Engage'
        },
        receipt: `refund-${model.id}-${Date.now()}`
      });

      LoggableMixin.error(new Error(`[PaymentRefund] Razorpay refund response: transaction_id=${modelData.transactionId}, response=${JSON.stringify(response)}`));

      if (response.status === 'processed') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.PROGRESS }, // Razorpay sets to progress initially
          { where: { id: model.transaction.id } }
        );
        LoggableMixin.error(new Error(`[PaymentRefund] Transaction status updated to progress: transaction_id=${modelData.transactionId}, model_id=${model.id}`));
      }
    },

    // Moyasar refund
    async moyasarRefund(model) {
      const modelData = await this.getModelData(model);
      const token = Buffer.from(dataGet(modelData, 'payload.secret_key')).toString('base64');
      const headers = {
        Authorization: `Basic ${token}`
      };

      const response = await axios.post(
        `https://api.moyasar.com/v1/payments/${modelData.transactionId}/refund`,
        { amount: modelData.price },
        { headers }
      );

      if (response.status === 200 && response.data.status === 'refunded') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Mollie refund
    async mollieRefund(model) {
      const modelData = await this.getModelData(model);
      const token = dataGet(modelData, 'payload.secret_key');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.post(
        `https://api.mollie.com/v2/payments/${modelData.transactionId}/refunds`,
        { amount: { value: `${modelData.price.toFixed(2)}`, currency: 'USD' } }, // Adjust currency as needed
        { headers }
      );

      if (response.status === 200 && response.data.status === 'refunded') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Maksekeskus refund
    async maksekeskusRefund(model) {
      const modelData = await this.getModelData(model);
      const shopId = dataGet(modelData, 'payload.shop_id');
      const keyPublishable = dataGet(modelData, 'payload.key_publishable');
      const keySecret = dataGet(modelData, 'payload.key_secret');
      const isDemo = dataGet(modelData, 'payload.demo', false);

      const mk = new Maksekeskus({ shopId, keyPublishable, keySecret, isDemo });

      const response = await mk.createRefund(modelData.transactionId, { amount: modelData.price });

      if (response.status === 200 && response.data.status === 'SETTLED') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Iyzipay refund
    async iyzicoRefund(model) {
      const modelData = await this.getModelData(model);
      const options = {
        apiKey: dataGet(modelData, 'payload.api_key'),
        secretKey: dataGet(modelData, 'payload.secret_key'),
        baseUrl: 'https://api.iyzipay.com'
      };

      const refundRequest = {
        paymentTransactionId: modelData.transactionId,
        price: modelData.price
      };

      const refund = await Iyzipay.Refund.create(refundRequest, options);

      if (refund.errorCode) {
        throw new Error(refund.errorMessage);
      }

      if (refund.status === 'success') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Paytabs refund
    async paytabsRefund(model) {
      const modelData = await this.getModelData(model);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: dataGet(modelData, 'payload.api_key')
      };

      const response = await axios.post(
        'https://secure-egypt.paytabs.com/payment/request',
        {
          tran_type: 'refund',
          tran_ref: modelData.transactionId
        },
        { headers }
      );

      if (response.status === 200) {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // PayPal refund
    async paypalRefund(model) {
      const modelData = await this.getModelData(model);
      const mode = dataGet(modelData, 'payload.paypal_mode', 'sandbox');
      const url = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
      const clientId = mode === 'live'
        ? dataGet(modelData, 'payload.paypal_live_client_id')
        : dataGet(modelData, 'payload.paypal_sandbox_client_id');
      const clientSecret = mode === 'live'
        ? dataGet(modelData, 'payload.paypal_live_client_secret')
        : dataGet(modelData, 'payload.paypal_sandbox_client_secret');

      const authResponse = await axios.post(
        `${url}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          }
        }
      );

      const { token_type, access_token } = authResponse.data;

      const response = await axios.post(
        `${url}/v2/payments/captures/${modelData.transactionId}/refund`,
        {},
        {
          headers: {
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
            Authorization: `${token_type} ${access_token}`
          }
        }
      );

      if (response.status === 200 && response.data.status === 'COMPLETED') {
        await sequelize.models.Transaction.update(
          { status: TRANSACTION_STATUS.REFUND },
          { where: { id: model.transaction.id } }
        );
      }
    },

    // Extract model data for refund
    async getModelData(model) {
      LoggableMixin.error(new Error(`[PaymentRefund] getModelData received model: model=${JSON.stringify(model)}`));

      const modelClass = model.constructor.name;
      let transactionId = null;
      const payload = dataGet(model, 'transaction.paymentSystem.paymentPayload.payload');
      const price = dataGet(model, 'transaction.price');

      LoggableMixin.error(new Error(`[PaymentRefund] Determining transactionId for model: model_class=${modelClass}`));

      if (modelClass === 'Order') {
        const paymentProcess = await sequelize.models.PaymentProcess.findOne({
          where: { id: dataGet(model, 'transaction.payment_trx_id') }
        });
        transactionId = paymentProcess?.razorpay_payment_id;
        LoggableMixin.error(new Error(`[PaymentRefund] Extracted transactionId from Order: transaction_id=${transactionId}, payload=${JSON.stringify(payload)}`));
      } else if (modelClass === 'ShopAdsPackage' || modelClass === 'ParcelOrder') {
        transactionId = dataGet(model, 'paymentProcess.id');
        LoggableMixin.error(new Error(`[PaymentRefund] Extracted transactionId from ${modelClass}: transaction_id=${transactionId}`));
      }

      LoggableMixin.error(new Error(`[PaymentRefund] getModelData result: model_class=${modelClass}, transaction_id=${transactionId}, price=${price}, payload=${JSON.stringify(payload)}`));

      return {
        transactionId,
        payload,
        price
      };
    }
  };
};

module.exports = PaymentRefund;