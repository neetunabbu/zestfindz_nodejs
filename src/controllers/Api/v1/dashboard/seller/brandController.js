const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const { Brand } = sequelize.models;

  return {
    // GET /brands — list all brands (non-paginated)
    index: async (req, res) => {
      try {
        const brands = await Brand.findAll({
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

    // GET /brands/paginate — paginated list with page & limit query
    paginate: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { rows: brands, count } = await Brand.findAndCountAll({
          where: { userId: req.userId },
          limit,
          offset,
          order: [['createdAt', 'DESC']],
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

    // POST /brands — create brand
    store: async (req, res) => {
      try {
        const { name, description, active } = req.body;

        // Generate required fields
        const uuid = uuidv4();
        const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : '';
        const title = name;

        const imageUrl = req.file ? `${req.file.filename}` : null;

        const newBrand = await Brand.create({
          uuid,
          slug,
          title,
          description,
          active: active !== undefined ? active : true,
          img: imageUrl,
          shop_id: req.shopId || null, // if you use shop_id
        });

        res.status(201).json({
          status: 'success',
          message: 'Brand successfully created',
          data: newBrand,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // GET /brands/:uuid — get single brand by uuid
    show: async (req, res) => {
      try {
        const { uuid } = req.params;
        const brand = await Brand.findOne({ where: { uuid } }); // removed userId
        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found' });
        }
        res.json({ status: 'success', data: brand });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // PUT /brands/:uuid — update brand
    update: async (req, res) => {
      try {
        const { uuid } = req.params;
        const brand = await Brand.findOne({ where: { uuid } }); // removed userId
        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found' });
        }
        const { name, description, active } = req.body;
        const imageUrl = req.file ? `${req.file.filename}` : brand.img;
        await brand.update({
          title: name,
          description,
          active: active !== undefined ? active : brand.active,
          img: imageUrl,
        });
        res.json({ status: 'success', message: 'Brand updated', data: brand });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // PATCH /brands/:id/active — toggle active status
    setActive: async (req, res) => {
      try {
        const { id } = req.params;
        const brand = await Brand.findOne({ where: { id, userId: req.userId } });

        if (!brand) {
          return res.status(404).json({ status: 'fail', message: 'Brand not found or unauthorized' });
        }

        await brand.update({ active: !brand.active });

        res.json({ status: 'success', message: 'Brand status toggled', data: brand });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // DELETE /brands — delete multiple brands (ids in body.ids array)
    destroy: async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ status: 'fail', message: 'No brand IDs provided' });
        }
        await Brand.destroy({
          where: {
            id: { [Op.in]: ids }
          }
        });
        res.json({ status: 'success', message: 'Brands successfully deleted' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    },

    // POST /brands/import — import brands from uploaded Excel file (expects file in req.file.buffer)
    fileImport: async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
      }

      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.getWorksheet(1);

        const importedBrands = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; 
          const [ , name, description, active ] = row.values; // adjust indexes per your Excel

          importedBrands.push({
            userId: req.userId,
            name: name || '',
            description: description || '',
            active: active?.toString().toLowerCase() === 'yes' || false,
          });
        });

        await Brand.bulkCreate(importedBrands);

        res.json({ status: 'success', message: 'Brands successfully imported' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Import failed: ' + error.message });
      }
    },

    // GET /brands/export — export brands to Excel file and send as attachment
    fileExport: async (req, res) => {
      try {
        const brands = await Brand.findAll({
          where: { userId: req.userId },
          order: [['createdAt', 'DESC']],
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Brands');

        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Name', key: 'name', width: 30 },
          { header: 'Description', key: 'description', width: 40 },
          { header: 'Active', key: 'active', width: 10 },
          { header: 'Created At', key: 'createdAt', width: 20 },
        ];

        brands.forEach(brand => {
          worksheet.addRow({
            id: brand.id,
            name: brand.name,
            description: brand.description,
            active: brand.active ? 'Yes' : 'No',
            createdAt: brand.createdAt.toISOString().split('T')[0],
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

  };
};
