const { Op } = require('sequelize');

module.exports = (sequelize) => {
  const { Category } = sequelize.models;

  // Predefined types
  const types = ['main', 'sub_main', 'child', 'receipt'];

  return {
    types: (req, res) => {
      res.json({ status: 'success', data: types });
    },
    parentCategory: async (req, res) => {
      try {
        const categories = await Category.findAll({ where: { parent_id: null }, order: [['sort', 'ASC']] });
        res.json({ status: 'success', data: categories });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/children/:id
    childrenCategory: async (req, res) => {
      try {
        const { id } = req.params;
        const categories = await Category.findAll({ where: { parent_id: id }, order: [['sort', 'ASC']] });
        res.json({ status: 'success', data: categories });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/paginate
    paginate: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { rows: categories, count } = await Category.findAndCountAll({
          where: { active: true },
          limit,
          offset,
          order: [['sort', 'ASC']]
        });

        res.json({
          status: 'success',
          data: categories,
          meta: { total: count, page, lastPage: Math.ceil(count / limit) }
        });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/select-paginate
    selectPaginate: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { rows: categories, count } = await Category.findAndCountAll({
          where: { active: true },
          attributes: ['uuid', 'title', 'slug', 'parent_id'],
          limit,
          offset,
          order: [['sort', 'ASC']]
        });

        res.json({
          status: 'success',
          data: categories,
          meta: { total: count, page, lastPage: Math.ceil(count / limit) }
        });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/search
    categoriesSearch: async (req, res) => {
      try {
        const search = req.query.search || '';
        const categories = await Category.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${search}%` } },
              { slug: { [Op.iLike]: `%${search}%` } }
            ],
            active: true
          },
          order: [['sort', 'ASC']],
          limit: 30
        });

        res.json({ status: 'success', data: categories });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/:uuid
    show: async (req, res) => {
      try {
        const { uuid } = req.params;
        const category = await Category.findOne({ where: { uuid } });

        if (!category) {
          return res.status(404).json({ status: 'fail', message: 'Category not found' });
        }

        // Optionally include translations, metaTags, or children with include option
        // await category.reload({ include: ['translations', 'metaTags', 'children'] });

        res.json({ status: 'success', data: category });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /rest/categories/slug/:slug
    showSlug: async (req, res) => {
      try {
        const { slug } = req.params;
        const category = await Category.findOne({ where: { slug } });

        if (!category) {
          return res.status(404).json({ status: 'fail', message: 'Category not found' });
        }

        // Optionally include translations, metaTags, or children with include option

        res.json({ status: 'success', data: category });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },
  };
};
