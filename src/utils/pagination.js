// utils/pagination.js

async function paginate(modelQuery, { page = 1, perPage = 10, ...options } = {}) {
  const limit = parseInt(perPage);
  const offset = (parseInt(page) - 1) * limit;

  const { count, rows } = await modelQuery.findAndCountAll({
    ...options,
    limit,
    offset,
  });

  return {
    data: rows,
    meta: {
      total: count,
      perPage: limit,
      currentPage: parseInt(page),
      lastPage: Math.ceil(count / limit),
    },
  };
}

module.exports = { paginate };
