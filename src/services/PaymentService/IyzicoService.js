const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./baseService'); // Assuming shared logic moved to baseService
const Iyzipay = require('iyzipay');
const { v4: uuidv4 } = require('uuid');

class IyzicoService {
  constructor(language = 'tr') {
    this.language = ['tr', 'en'].includes(language.toLowerCase()) ? language.toUpperCase() : 'TR';
  }

  async processTransaction(data, req) {
    const host = `${req.protocol}://${req.get('host')}`;
    const authUser = req.user; // Assume middleware adds user

    const payment = await Payment.findOne({ where: { tag: 'iyzico' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload || {};

    const [key, before] = await getPayload(data, payload); // Call the base method
    const modelId = before.model_id;
    const totalPrice = Math.ceil(before.total_price);

    const returnUrl = `${host}/order-stripe-success?${key}=${modelId}&lang=${this.language}`;
    const currency = (before.currency || 'TRY').toUpperCase();

    const supportedCurrencies = [
      'TRY', 'EUR', 'USD', 'GBP', 'IRR', 'NOK', 'RUB', 'CHF'
    ];

    if (!supportedCurrencies.includes(currency)) {
      throw new Error(`Currency ${currency} is not supported`);
    }

    const conversationId = `${Date.now()}`;

    const iyzipay = new Iyzipay({
      apiKey: payload.api_key,
      secretKey: payload.secret_key,
      uri: payload.sandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com'
    });

    if (!payload.sub_merchant_key && !payload.sandbox) {
      const subMerchantRequest = {
        locale: 'TR',
        conversationId,
        subMerchantExternalId: uuidv4(),
        subMerchantType: 'PRIVATE_COMPANY',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        taxOffice: 'Tax office',
        legalCompanyTitle: 'John Doe inc',
        email: 'example@gmail.com',
        gsmNumber: '+905350000000',
        name: "John's market",
        iban: 'TR180006200119000006672315',
        identityNumber: '31300864726',
        currency: 'TRY',
      };

      const subMerchantResult = await new Promise((resolve, reject) => {
        Iyzipay.SubMerchant.create(subMerchantRequest, iyzipay, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (subMerchantResult?.status === 'success') {
        payload.sub_merchant_key = subMerchantResult.subMerchantKey;
        await paymentPayload.update({ payload });
      } else {
        throw new Error(subMerchantResult.errorMessage);
      }
    }

    const request = {
      locale: this.language,
      conversationId,
      price: totalPrice.toFixed(2),
      paidPrice: totalPrice.toFixed(2),
      currency,
      basketId: modelId.toString(),
      paymentGroup: 'PRODUCT',
      callbackUrl: returnUrl,
      enabledInstallments: [1],
      buyer: {
        id: modelId.toString(),
        name: 'User',
        surname: 'Name',
        gsmNumber: '+905350000000',
        email: 'example@gmail.com',
        identityNumber: `Buyer-${modelId}`,
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: req.ip,
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
      },
      shippingAddress: {
        contactName: 'User Name',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742',
      },
      billingAddress: {
        contactName: 'User Name',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34742',
      },
      basketItems: [
        {
          id: modelId.toString(),
          name: 'product',
          category1: 'product',
          category2: 'product',
          itemType: 'PHYSICAL',
          price: totalPrice.toFixed(2),
          ...(payload.sandbox ? {} : { 
            subMerchantKey: payload.sub_merchant_key, 
            subMerchantPrice: totalPrice.toFixed(2) 
          }),
        },
      ],
    };

    const iyzicoInitResult = await new Promise((resolve, reject) => {
      Iyzipay.PayWithIyzicoInitialize.create(request, iyzipay, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (iyzicoInitResult.status !== 'success') {
      throw new Error(iyzicoInitResult.errorMessage);
    }

    return await PaymentProcess.upsert({
      id: iyzicoInitResult.token,
      user_id: authUser.id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        url: iyzicoInitResult.payWithIyzicoPageUrl,
        con_id: iyzicoInitResult.conversationId,
        price: totalPrice,
        payment_id: payment.id,
      },
    });
  }
}

module.exports = IyzicoService;
