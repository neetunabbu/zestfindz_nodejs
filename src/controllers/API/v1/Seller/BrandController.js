// D:\zestfindz_nodejs\src\controllers\API\v1\Seller\BrandController.js

const BrandService = require('../../../../services/BrandService');
const BrandRepository = require('../../../../repositories/BrandRepository');
const BrandResource = require('../../../../resources/BrandResource');
const ResponseError = require('../../../../helpers/ResponseError');
const BrandExport = require('../../../../../../exports/BrandExport');
const BrandImport = require('../../../../imports/BrandImport');
const Excel = require('exceljs');
const fs = require('fs');

class BrandController {
  constructor(shop, language = 'en') {
    this.service = new BrandService();
    this.repository = new BrandRepository();
    this.shop = shop;
    this.language = language;
  }

  async index(req, res) {
    const brands = await this.repository.brandsList({ ...req.query, shop_id: this.shop.id });
    return res.json({
      message: 'Success',
      data: BrandResource.collection(brands)
    });
  }

  async paginate(req, res) {
    const brands = await this.repository.brandsPaginate({ ...req.query, shop_id: this.shop.id });
    return res.json(BrandResource.collection(brands));
  }

  async store(req, res) {
    const validated = { ...req.body, shop_id: this.shop.id };
    const result = await this.service.create(validated);

    if (!result.status) return res.status(400).json(result);

    return res.json({
      message: 'Brand created successfully',
      data: BrandResource.make(result.data)
    });
  }

  async show(req, res) {
    const brand = await this.repository.brandDetails(req.params.id);

    if (brand.shop_id !== this.shop.id) {
      return res.status(404).json({
        code: ResponseError.ERROR_404,
        message: 'Brand not found'
      });
    }

    return res.json({
      message: 'Success',
      data: BrandResource.make({ ...brand, metaTags: brand.metaTags })
    });
  }

  async update(req, res) {
    const brand = await this.repository.brandDetails(req.params.id);
    const validated = { ...req.body, shop_id: this.shop.id };
    const result = await this.service.update(brand, validated);

    if (!result.status) return res.status(400).json(result);

    return res.json({
      message: 'Brand updated successfully',
      data: BrandResource.make(result.data)
    });
  }

  async brandsSearch(req, res) {
    const brands = await this.repository.brandsSearch({ ...req.query, shop_id: this.shop.id });
    return res.json(BrandResource.collection(brands));
  }

  async setActive(req, res) {
    const brand = await this.repository.brandDetails(req.params.id);

    if (brand.shop_id !== this.shop.id) {
      return res.status(404).json({
        code: ResponseError.ERROR_404,
        message: 'Brand not found'
      });
    }

    brand.active = !brand.active;
    await brand.save();

    return res.json({
      message: 'Status updated',
      data: BrandResource.make(brand)
    });
  }

  async fileExport(req, res) {
    try {
      const filePath = 'public/export/brands.xlsx';
      await BrandExport.exportToFile(req.query, filePath);

      return res.json({
        message: 'Successfully exported',
        data: {
          path: 'public/export',
          file_name: filePath
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Error during export' });
    }
  }

  async fileImport(req, res) {
    try {
      const file = req.file; // Assuming multer middleware used
      await BrandImport.importFromFile(file.path, this.shop.id);

      return res.json({ message: 'Successfully imported' });
    } catch (e) {
      return res.status(500).json({
        code: ResponseError.ERROR_508,
        message: `Import error | ${e.message}`
      });
    }
  }

  async destroy(req, res) {
    const result = await this.service.delete(req.body.ids || [], this.shop.id);

    if (result.data) {
      return res.status(400).json({
        code: result.code,
        message: `Error ${result.code}`
      });
    }

    return res.json({
      message: 'Brand(s) deleted successfully'
    });
  }
}

module.exports = BrandController;
