const { UserActivity } = require('../../models');
const CoreRepository = require('../CoreRepository');

const userActivityRepository = {

  async paginate(req, filters = {}) {
    const core = await CoreRepository(req, () => UserActivity);
    const model = core.getModel();
    const page = parseInt(filters.page, 10) || 1;
    const perPage = parseInt(filters.perPage, 10) || 10;
    const offset = (page - 1) * perPage;
    const orderBy = filters.column || 'id';
    const sort = filters.sort || 'DESC';

    const { rows: data, count: total } = await model.scope({ method: ['filter', filters] }).findAndCountAll({
      limit: perPage,
      offset,
      order: [[orderBy, sort.toUpperCase()]],
    });
    // console.log('Applied filters:', filters);
    const data2 = await UserActivity.findAll(); // Just for testing
      console.log(data2);
    return {
      currentPage: page,
      perPage,
      total,
      lastPage: Math.ceil(total / perPage),
      data,
      currency: core.getCurrency(),
      lang: core.getLanguage(),
      updatedAt: core.getUpdatedDate(),
    };
  }

};

module.exports = userActivityRepository;
