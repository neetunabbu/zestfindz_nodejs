// src/controllers/v1/dashboard/user/requestModelController.js

import { RequestModel } from '../../../../../models/RequestModel';
import { RequestModelRepository } from '../../../../../repositories/RequestModelRepository/RequestModelRepository';
import { RequestModelService } from '../../../services/RequestModelService';
import { successResponse, errorResponse } from '../../../../../Traits/ApiResponse';

export const requestModelController = {
  async index(req, res) {
    try {
      const filter = {
        ...req.query,
        created_by: req.user.id,
        type: 'user',
      };

      const models = await RequestModelRepository.index(filter);
      return res.json(successResponse('Success', models));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch request models', error));
    }
  },

  async store(req, res) {
    try {
      const user = req.user;

      if (user.hasRole(['admin', 'seller', 'deliveryman'])) {
        return res.status(400).json(errorResponse('Invalid role for request'));
      }

      const payload = {
        ...req.body,
        id: user.id,
        type: 'user',
        created_by: user.id,
        data: {
          ...req.body.data,
          role: 'deliveryman',
        },
      };

      const result = await RequestModelService.create(payload);

      return res.json(successResponse('Created successfully', result));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to create request model', error));
    }
  },

  async show(req, res) {
    try {
      const requestModel = await RequestModel.findByPk(req.params.id);
      if (!requestModel || requestModel.created_by !== req.user.id) {
        return res.status(404).json(errorResponse('Request model not found'));
      }

      const model = await RequestModelRepository.show(requestModel);
      return res.json(successResponse('Success', model));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch request model', error));
    }
  },

  async update(req, res) {
    try {
      const requestModel = await RequestModel.findByPk(req.params.id);
      if (!requestModel || requestModel.created_by !== req.user.id) {
        return res.status(404).json(errorResponse('Request model not found'));
      }

      const payload = {
        ...req.body,
        data: {
          ...req.body.data,
          role: 'deliveryman',
        },
      };

      const result = await RequestModelService.update(requestModel, payload);
      return res.json(successResponse('Updated successfully', result));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to update request model', error));
    }
  },

  async destroy(req, res) {
    try {
      const result = await RequestModelService.delete([req.params.id], req.user.id);

      if (!result.status) {
        return res.status(400).json(errorResponse(result.message));
      }

      return res.json(successResponse('Request model deleted successfully'));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to delete request model', error));
    }
  },
};
