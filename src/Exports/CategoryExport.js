const ExcelJS = require('exceljs');
const { Category, Language } = require('../models');
const { Op } = require('sequelize');

class CategoryExport {
  constructor(language, filter = {}) {
    this.language = language;
    this.filter = filter;
    this.headings = [
      'Id', 'Uu Id', 'Keywords', 'Parent Id', 'Title',
      'Description', 'Active', 'Status', 'Type', 'Age Limit', 'Img Urls',
    ];
  }

  async exportToWorkbook() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categories');

    worksheet.addRow(this.headings);

    const data = await this.getData();
    data.forEach(row => worksheet.addRow(Object.values(row)));

    return workbook;
  }

  async getData() {
    const defaultLocale = await Language.findOne({ where: { default: true } });
    const locale = defaultLocale?.locale || 'en';

    if (!this.filter.type) {
      this.filter.type = 'main';
    }

    const column = this.filter.column || 'id';
    const sort = this.filter.sort || 'desc';

    const categories = await Category.scope({ method: ['filter', this.filter] }).findAll({
      include: [
        {
          association: 'translation',
          where: {
            locale: {
              [Op.or]: [this.language, locale],
            },
          },
          required: false,
        },
        {
          association: 'children',
          include: [
            {
              association: 'translation',
              where: {
                locale: {
                  [Op.or]: [this.language, locale],
                },
              },
              required: false,
            },
          ],
        },
      ],
      order: [[column, sort]],
    });

    const rows = [];
    for (const category of categories) {
      const merged = await this.mergeCategories(category);
      rows.push(...merged);
    }

    return rows;
  }

  async mergeCategories(category) {
    let result = [this.formatRow(category)];

    for (const child of category.children || []) {
      const childRows = await this.mergeCategories(child);
      result = result.concat(childRows);
    }

    return result;
  }

  formatRow(category) {
    const translation = category.translation?.[0] || {};
    return {
      id: category.id,
      uuid: category.uuid,
      keywords: category.keywords,
      parent_id: category.parent_id,
      title: translation.title || '',
      description: translation.description || '',
      active: category.active ? 'active' : 'inactive',
      status: category.status,
      type: category.type || '',
      age_limit: category.age_limit,
      img_urls: this.imageUrl(category.galleries || []),
    };
  }

  imageUrl(galleries) {
    return galleries.map(g => g.path).join(', ');
  }
}

module.exports = CategoryExport;
