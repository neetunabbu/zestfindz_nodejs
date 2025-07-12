// src/controllers/API/v1/Dashboard/Seller/ProductController.js

const ProductService = require('../../../../../services/ProductService');
const ProductRepository = require('../../../../../repositories/ProductRepository');
const ProductAdditionalService = require('../../../../../services/ProductAdditionalService');
const ResponseError = require('../../../../../helpers/ResponseError');
const ProductResource = require('../../../../../resources/ProductResource');
const StockResource = require('../../../../../resources/StockResource');
const ExcelJS = require('exceljs');
const cache = require('../../../../../helpers/cache');
const exportProductsToExcel = require('../../../../../exports/ProductExport');

class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.productRepository = new ProductRepository();
  }

  async paginate(req, res) {
    const params = { ...req.query, shop_id: req.shop.id, lang: req.language };
    const products = await this.productRepository.productsPaginate(params);
    return res.json(ProductResource.collection(products));
  }

  async store(req, res) {
    try {
      const isSubscribe = parseInt(await Settings.getValue('by_subscription'));
      if (isSubscribe) {
        const productsCount = await Product.count({ where: { shop_id: req.shop.id } });
        const subscribe = req.shop.subscription;

        if (!subscribe) {
          return res.status(400).json({ code: ResponseError.ERROR_219, message: 'Subscription not found' });
        }

        if (subscribe.product_limit < productsCount) {
          return res.status(400).json({ code: ResponseError.ERROR_220, message: 'Product limit exceeded' });
        }
      }

      const validated = req.body;
      validated.shop_id = req.shop.id;
      validated.weight = req.body.weight || 'N/A';

      const result = await this.productService.create(validated);

      if (!result.status) return res.status(400).json(result);

      return res.json({ message: 'Product created successfully', data: ProductResource.make(result.data) });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async show(req, res) {
    const product = await this.productRepository.productByUUID(req.params.uuid);
    if (product.shop_id !== req.shop.id) return res.status(404).json({ code: ResponseError.ERROR_404 });

    return res.json({ message: 'Success', data: ProductResource.make(product) });
  }

  async update(req, res) {
    const product = await Product.findOne({ where: { uuid: req.params.uuid } });
    if (product.shop_id !== req.shop.id) return res.status(404).json({ code: ResponseError.ERROR_404 });

    const validated = req.body;
    validated.shop_id = req.shop.id;
    validated.status = product.status;
    validated.weight = req.body.weight || product.weight;

    await Product.update({ weight: validated.weight }, { where: { uuid: req.params.uuid } });

    const result = await this.productService.update(req.params.uuid, validated);
    if (!result.status) return res.status(400).json(result);

    return res.json({ message: 'Product updated successfully', data: ProductResource.make(result.data) });
  }

  async destroy(req, res) {
    await this.productService.delete(req.body.ids || [], req.shop.id);
    return res.json({ message: 'Product(s) deleted successfully' });
  }

  async addInStock(req, res) {
    const data = { ...req.body, shop_id: req.shop.id };
    const result = await new ProductAdditionalService().addInStock(req.params.uuid, data);

    if (!result.status) return res.status(400).json(result);
    return res.json({ message: 'Stock added successfully', data: ProductResource.make(result.data) });
  }

  async stockGalleryUpdate(req, res) {
    const data = { ...req.body, shop_id: req.shop.id };
    const result = await new ProductAdditionalService().stockGalleryUpdate(data);

    if (!result.status) return res.status(400).json(result);
    return res.json({ message: 'Gallery updated', data: StockResource.collection(result.data) });
  }

  async addProductProperties(req, res) {
    const product = await Product.findOne({ where: { uuid: req.params.uuid } });
    const result = await new ProductAdditionalService().createOrUpdateProperties(product.uuid, req.body);

    if (!result.status) return res.status(400).json(result);
    return res.json({ message: 'Properties added', data: ProductResource.make(result.data) });
  }

  async productsSearch(req, res) {
    const products = await this.productRepository.productsSearch({ ...req.query, shop_id: req.shop.id });
    return res.json(ProductResource.collection(products));
  }

  async setActive(req, res) {
    const product = await Product.findOne({ where: { uuid: req.params.uuid } });
    if (!product || product.shop_id !== req.shop.id) return res.status(404).json({ code: ResponseError.ERROR_404 });

    await product.update({ active: !product.active });
    return res.json({ message: 'Status changed', data: ProductResource.make(product) });
  }

  async selectStockPaginate(req, res) {
    const stocks = await this.productRepository.selectStockPaginate({ ...req.query, shop_id: req.shop.id });
    if (!cache.get('rjkcvd.ewoidfh') || cache.get('rjkcvd.ewoidfh').active !== 1) return res.sendStatus(403);

    return res.json(StockResource.collection(stocks));
  }

  async parentSync(req, res) {
    const result = await this.productService.parentSync({ ...req.body, shop_id: req.shop.id });
    if (!result.status) return res.status(400).json(result);

    return res.json({ message: result.message || 'Synced', data: result.data });
  }

  async fileExport(req, res) {
    const fileName = 'public/export/products.xlsx';
    try {
      await exportProductsToExcel(
        { ...req.query, shop_id: req.shop.id, language: req.language },
        fileName
      );
      return res.json({ message: 'Successfully exported', path: 'public/export', file_name: fileName });
    } catch (e) {
      return res.status(500).json({ message: 'Error during export' });
    }
  }

  async fileImport(req, res) {
    try {
      await this.productService.importProducts(req.file, req.shop.id, req.language);
      return res.json({ message: 'Successfully imported' });
    } catch (e) {
      return res.status(400).json({ code: ResponseError.ERROR_508, message: 'Excel format incorrect or data invalid' });
    }
  }
}

module.exports = new ProductController();
