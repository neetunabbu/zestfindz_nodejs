const { Warehouse } = require('../../models'); // Adjust as needed
const ResponseError = require('../../helpers/ResponseError'); // Adjust as needed

// Placeholder for translation utility (implement as needed)
const setTranslations = async (model, data) => {
  // ... logic (e.g. model.setTranslations([...]))
};

// Placeholder for image uploads
// Expects instance method model.uploads(images) and model.galleries() return Promise/hasMany association
class WarehouseService {
  async create(data) {
    try {
      let model = await Warehouse.create(data);

      if (data.images && data.images[0]) {
        await model.update({ img: data.images[0] });
        if (typeof model.uploads === 'function') {
          await model.uploads(data.images);
        }
      }

      await setTranslations(model, data);

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: 'Warehouse creation failed'
      };
    }
  }

  async update(warehouse, data) {
    try {
      await warehouse.update(data);
      if (data.images && data.images[0]) {
        if (typeof warehouse.galleries === 'function') {
          // Delete all gallery images
          const galleries = await warehouse.galleries();
          for (const gallery of galleries) await gallery.destroy();
        }
        await warehouse.update({ img: data.images[0] });
        if (typeof warehouse.uploads === 'function') {
          await warehouse.uploads(data.images);
        }
      }

      await setTranslations(warehouse, data);

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: warehouse
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: 'Warehouse update failed'
      };
    }
  }

  async changeActive(id) {
    try {
      const model = await Warehouse.findByPk(id);
      if (!model) throw new Error('Warehouse not found');
      await model.update({ active: !model.active });
      return { status: true, message: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: 'Unable to change active status'
      };
    }
  }

  async delete(ids = []) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) return;
      const models = await Warehouse.findAll({ where: { id: ids } });

      for (const model of models) {
        // Working days, closed dates, galleries: cascade delete
        if (typeof model.workingDays === 'function') {
          const days = await model.workingDays();
          for (const day of days) await day.destroy();
        }
        if (typeof model.closedDates === 'function') {
          const closedDates = await model.closedDates();
          for (const cl of closedDates) await cl.destroy();
        }
        if (typeof model.galleries === 'function') {
          const galleries = await model.galleries();
          for (const gal of galleries) await gal.destroy();
        }
        await model.destroy();
      }
    } catch (e) {
      console.error(e);
      // Optional: return error status
    }
  }
}

module.exports = WarehouseService;
