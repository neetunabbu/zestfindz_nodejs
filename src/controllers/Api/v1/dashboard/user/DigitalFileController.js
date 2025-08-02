const DigitalFileService = require('../../../../../services/DigitalFileService/DigitalFileService');
const DigitalFileRepository = require('../../../../../repositories/DigitalFileRepository/DigitalFileRepository');

const digitalFileRepository = new DigitalFileRepository();

const DigitalFileController = {
  // GET /digital-files
  async index(req, res) {
    try {
      const filter = req.query;
      const result = await digitalFileRepository.paginate(filter);

      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.error('Index Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  },

  // GET /my-digital-files
  async myDigitalFiles(req, res) {
    try {
      const filter = req.query;
      const userId = req.user?.id || 1;

      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      }

      const result = await digitalFileRepository.myDigitalFiles(userId, filter);

      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.error('My Digital Files Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  },

  // GET /digital-files/:id
  async getDigitalFile(req, res) {
    try {
      const id = req.params.id || '1';
      const userId = req.user?.id || 1;

      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      }

      const model = await digitalFileRepository.getDigitalFile(id, userId);
      const result = await DigitalFileService.getDigitalFile(model);

      if (!result.status) {
        return res.status(404).json({
          status: 'fail',
          message: result.message || 'Digital file not found',
        });
      }

      return res.status(200).json({
        status: 'success',
        fileUrl: result.data,
      });
    } catch (err) {
      console.error('Get Digital File Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  },

  // POST /digital-files
  async uploadFile(req, res) {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ status: 'fail', message: 'File is required' });
      }

      const data = {
        product_id: req.body.product_id || 1,
        file,
        user_id: userId,
      };

      const result = await DigitalFileService.create(data);

      if (!result.status) {
        return res.status(400).json({
          status: 'fail',
          message: result.message || 'Upload failed',
        });
      }

      const [modelInstance] = result.data; // destructure from upsert()

      return res.status(201).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: modelInstance,
      });
    } catch (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }
};

module.exports = DigitalFileController;
