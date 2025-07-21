const Joi = require('joi');
const { SmsPayload } = require('../../models'); // adjust path
const ResponseError = require('../../helpers/ResponseError'); // adjust as needed

class SmsPayloadService {
  getModelClass() {
    return SmsPayload;
  }

  // CREATE
  async create(data) {
    // Validate config for given type
    const prepareValidate = this.prepareValidate(data);
    if (!prepareValidate.status) {
      return prepareValidate;
    }

    try {
      // If default: unset other defaults
      if (parseInt(data.default) === 1) {
        await SmsPayload.update({ default: 0 }, { where: { default: 1 } });
      }

      const payload = await SmsPayload.create(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: payload
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  // UPDATE by smsType
  async update(smsType, data) {
    let e;
    try {
      data.type = smsType;

      const prepareValidate = this.prepareValidate(data);
      if (!prepareValidate.status) {
        return prepareValidate;
      }

      const payload = await SmsPayload.findOne({ where: { type: smsType } });
      if (!payload) throw { code: ResponseError.ERROR_404, message: ResponseError.ERROR_404 };

      if (parseInt(data.default) === 1) {
        await SmsPayload.update({ default: 0 }, { where: { default: 1 } });
      }

      await payload.update(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: payload
      };
    } catch (err) {
      e = err;
      console.error(e);
      return {
        status: false,
        code: e?.code === 0 ? ResponseError.ERROR_404 : ResponseError.ERROR_501,
        message: e?.code === 0 ? ResponseError.ERROR_404 : e?.message
      };
    }
  }

  // DELETE by types
  async delete(ids = []) {
    if (!Array.isArray(ids) || ids.length < 1) {
      return {
        status: false,
        code: ResponseError.ERROR_400
      };
    }

    await SmsPayload.destroy({ where: { type: ids } });
    return {
      status: true,
      code: ResponseError.NO_ERROR
    };
  }

  // VALIDATOR dispatcher
  prepareValidate(data) {
    if (data.type === SmsPayload.FIREBASE) {
      const { error } = this.firebaseSchema().validate(data, { abortEarly: false });
      if (error) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
          params: error.details.map(d => d.message)
        };
      }
      return { status: true };

    } else if (data.type === SmsPayload.TWILIO) {
      const { error } = this.twilioSchema().validate(data, { abortEarly: false });
      if (error) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
          params: error.details.map(d => d.message)
        };
      }
      return { status: true };
    }

    return {
      status: false,
      code: ResponseError.ERROR_404,
      message: 'Validation error'
    };
  }

  // FIREBASE Joi schema
  firebaseSchema() {
    return Joi.object({
      type: Joi.string().required(),
      'payload.api_key': Joi.string().required(),
      'payload.ios_api_key': Joi.string().required(),
      'payload.android_api_key': Joi.string().required(),
      'payload.server_key': Joi.string().required(),
      'payload.vapid_key': Joi.string().required(),
      'payload.auth_domain': Joi.string().required(),
      'payload.project_id': Joi.string().required(),
      'payload.storage_bucket': Joi.string().required(),
      'payload.message_sender_id': Joi.string().required(),
      'payload.app_id': Joi.string().required(),
      'payload.measurement_id': Joi.string().required(),
      default: Joi.number().optional()
    });
  }

  // TWILIO Joi schema
  twilioSchema() {
    return Joi.object({
      type: Joi.string().required(),
      'payload.twilio_account_id': Joi.string().required(),
      'payload.twilio_auth_token': Joi.string().required(),
      'payload.twilio_number': Joi.string().required(),
      default: Joi.number().optional()
    });
  }
}

module.exports = SmsPayloadService;
