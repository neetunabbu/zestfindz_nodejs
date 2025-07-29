// src/controllers/v1/dashboard/user/userActivityController.js

import { userActivityRepository } from '../../../../../repositories/userActivityRepository';
import { userActivityService } from '../../../../../services/userActivityService';
import { successResponse, errorResponse } from '../../../../../utils/apiResponse';

export const userActivityController = {
  async index(req, res) {
    try {
      const filter = {
        ...req.query,
        user_id: req.user.id,
      };

      const activities = await userActivityRepository.paginate(filter);
      return res.json(successResponse('User activities fetched successfully', activities));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch user activities', error));
    }
  },

  async storeMany(req, res) {
    try {
      const ids = req.body.ids || [];
      const result = await userActivityService.createMany(ids);

      if (!result.status) {
        return res.status(400).json(errorResponse(result.message));
      }

      return res.json(successResponse('User activities created successfully'));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to create user activities', error));
    }
  },
};
