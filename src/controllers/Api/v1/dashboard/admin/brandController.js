const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const { Brand } = sequelize.models;

  return {
    index: async (req, res) => {
      try {
        const filters = { ...req.query };
        const brands = await Brand.findAll({
          where: filters,
          order: [['created_at', 'DESC']],
        });

        res.json({
          status: 'success',
          message: 'Brands fetched successfully',
          data: brands,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /admin/brands/paginate
    paginate: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const filters = { ...req.query }; 

        const { rows: brands, count } = await Brand.findAndCountAll({
          where: filters,
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

    // POST /admin/brands — create brand
    store: async (req, res) => {
      try {
        const { title, description, active } = req.body;

        if (!title) {
          return res.status(400).json({ status: 'fail', message: 'Title is required' });
        }

        const uuid = uuidv4();
        const slug = title.toLowerCase().replace(/\s+/g, '-');

        // Image handling, if using file upload. Adjust according to your middleware
        const imageUrl = req.file ? req.file.filename : null;

        const brand = await Brand.create({
          uuid,
          slug,
          title,
          description,
          active: active !== undefined ? active : true,
          img: imageUrl,
        });

        res.status(201).json({
          status: 'success',
          message: 'Brand successfully created',
          data: brand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /admin/brands/:uuid
    show: async (req, res) => {
      try {
        const { uuid } = req.params;
        const brand = await Brand.findOne({ where: { uuid } });

        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found' });
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

    // PUT /admin/brands/:uuid
    update: async (req, res) => {
      try {
        const { uuid } = req.params;
        const brand = await Brand.findOne({ where: { uuid } });

        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found' });
        }

        const { title, description, active } = req.body;
        const imageUrl = req.file ? req.file.filename : brand.img;

        await brand.update({
          title,
          description,
          active: active !== undefined ? active : brand.active,
          img: imageUrl,
          slug: title ? title.toLowerCase().replace(/\s+/g, '-') : brand.slug,
        });

        res.json({
          status: 'success',
          message: 'Brand successfully updated',
          data: brand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // DELETE /admin/brands/delete — delete multiple
    destroy: async (req, res) => {
      try {
        const ids = req.body.ids || [];

        if (!Array.isArray(ids) || !ids.length) {
          return res.status(400).json({ status: 'fail', message: 'No brand IDs provided' });
        }

        await Brand.destroy({
          where: {
            id: { [Op.in]: ids },
          },
        });

        res.json({
          status: 'success',
          message: 'Brands successfully deleted',
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /admin/brands/drop/all
    dropAll: async (req, res) => {
      try {
        await Brand.destroy({ where: {}, truncate: true });

        res.json({
          status: 'success',
          message: 'All brands deleted',
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /admin/brands/search
    brandsSearch: async (req, res) => {
      try {
        const searchTerm = req.query.search || '';
        const brands = await Brand.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${searchTerm}%` } },
              { slug: { [Op.iLike]: `%${searchTerm}%` } },
            ],
          },
          limit: 30,
          order: [['created_at', 'DESC']],
        });

        res.json({ status: 'success', data: brands });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // PATCH /admin/brands/:id/active
    setActive: async (req, res) => {
      try {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);

        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found' });
        }

        await brand.update({ active: !brand.active });

        res.json({
          status: 'success',
          message: 'Brand active status toggled',
          data: brand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /admin/brands/export
    fileExport: async (req, res) => {
      try {
        const brands = await Brand.findAll({
          order: [['created_at', 'DESC']],
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Brands');

        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Title', key: 'title', width: 30 },
          { header: 'Slug', key: 'slug', width: 30 },
          { header: 'Active', key: 'active', width: 10 },
          { header: 'Created At', key: 'created_at', width: 20 },
        ];

        brands.forEach((b) => {
          worksheet.addRow({
            id: b.id,
            title: b.title,
            slug: b.slug,
            active: b.active ? 'Yes' : 'No',
            created_at: b.created_at.toISOString().slice(0, 10),
          });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=brands.xlsx');

        await workbook.xlsx.write(res);
        res.end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Export failed' });
      }
    },

    // POST /admin/brands/import
    fileImport: async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
      }
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const brandsToImport = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // skip header
          const title = row.getCell(2).text;
          const slug = row.getCell(3).text;
          const activeText = row.getCell(4).text.toLowerCase();
          const active = activeText === 'yes';

          brandsToImport.push({ title, slug, active });
        });

        await Brand.bulkCreate(brandsToImport);

        res.json({ status: 'success', message: 'Brands imported successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Import failed' });
      }
    },
  };
};
