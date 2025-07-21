module.exports = (sequelize) => {
  const { Brand } = sequelize.models;

  return {
    // Paginate brands (GET /rest/brands/paginate)
    paginate: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { rows: brands, count } = await Brand.findAndCountAll({
          where: { active: true },
          limit,
          offset,
          order: [['created_at', 'DESC']],
        });

        res.json({
          status: 'success',
          data: brands,
          meta: {
            total: count,
            page,
            lastPage: Math.ceil(count / limit),
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    show: async (req, res) => {
      try {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);

        if (!brand) {
          return res.status(404).json({
            status: 'fail',
            code: 404,
            message: 'Brand not found',
          });
        }

        res.json({
          status: 'success',
          data: brand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    showSlug: async (req, res) => {
      try {
        const { slug } = req.params;
        const brand = await Brand.findOne({ where: { slug } });

        if (!brand) {
          return res.status(404).json({
            status: 'fail',
            code: 404,
            message: 'Brand not found',
          });
        }
        res.json({
          status: 'success',
          data: brand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },
  };
};
