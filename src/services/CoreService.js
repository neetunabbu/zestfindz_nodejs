const { Currency, Language } = require('../models');
const ResponseError = require('../helpers/ResponseError');
// const ApiResponse = require('../Traits/ApiResponse');
const logger = require('../Traits/Loggable');
const cache = require('../utils/cache'); 

function cloneModel(Model) {
  return Model;
}

async function setCurrency(req) {
  try {
    return (
      req?.query?.currency_id ||
      (await Currency.findOne({ where: { is_default: true } }))?.id ||
      null
    );
  } catch (e) {
    logger.error('setCurrency error', e);
    return null;
  }
}

async function setLanguage(req) {
  try {
    return (
      req?.query?.lang ||
      (await Language.findOne({ where: { is_default: true } }))?.locale ||
      'en'
    );
  } catch (e) {
    logger.error('setLanguage error', e);
    return 'en';
  }
}

async function dropAll(Model, req, exclude = null) {
  try {
    const query = {};

    if (exclude?.column && exclude?.value !== undefined) {
      query[exclude.column] = { [Op.ne]: exclude.value };
    }

    const models = await Model.findAll({ where: query });

    for (const record of models) {
      try {
        await record.destroy();
      } catch (err) {
        logger.error('Drop error', err);
      }
    }

    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);

    return { status: true, code: ResponseError.NO_ERROR };
  } catch (error) {
    logger.error('dropAll error', error);
    return { status: false, code: ResponseError.ERROR_500, message: error.message };
  }
}

async function destroy(Model, ids = []) {
  try {
    const records = await Model.findAll({ where: { id: ids } });
    for (const record of records) {
      try {
        await record.destroy();
      } catch (e) {
        logger.error('destroy error', e);
      }
    }
    const s = await cache.get('rjkcvd.ewoidfh');
    await cache.flush();
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    logger.error('destroy outer error', error);
  }
}

async function remove(Model, ids = [], column = 'id', when = { column: null, value: null }, language = 'en') {
  const errorIds = [];

  try {
    const where = {
      [column]: ids,
    };

    if (when?.column && when?.value !== undefined) {
      where[when.column] = when.value;
    }

    const records = await Model.findAll({ where });

    for (const record of records) {
      try {
        await record.destroy();
      } catch (e) {
        logger.error('remove error', e);
        errorIds.push(record.id);
      }
    }

    if (errorIds.length === 0) {
      return { status: true, code: ResponseError.NO_ERROR };
    }

    return {
      status: false,
      code: ResponseError.ERROR_505,
      message: `Can't delete IDs: ${errorIds.join(', ')}`,
    };
  } catch (error) {
    logger.error('remove outer error', error);
    return {
      status: false,
      code: ResponseError.ERROR_500,
      message: error.message,
    };
  }
}

module.exports = {
  setCurrency,
  setLanguage,
  dropAll,
  destroy,
  remove,
  cloneModel,
};

