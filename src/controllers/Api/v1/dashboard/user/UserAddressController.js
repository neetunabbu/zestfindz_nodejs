const { UserAddress } = require('../../../../../models');
const axios = require('axios');
const { successResponse, errorResponse } = require('../../../../../Traits/ApiResponse');

const UserAddressController = {
  async index(req, res) {
    try {
      const userId = req.user?.id || 1;
      const where = { user_id: userId };

      const addresses = await UserAddress.findAll({ where });
      // console.log("Fetched addresses:", addresses);

      for (const address of addresses) {
        try {
          const response = await axios.get('https://staging-express.delhivery.com/c/api/pin-codes/json/', {
            headers: {
              Authorization: 'Token 91b6796b405cff3518be0752768e81fca4d1984a',
            },
            params: {
              filter_codes: address.zipcode,
            },
          });

          const isServiceable = Array.isArray(response.data.delivery_codes) && response.data.delivery_codes.length > 0;
          address.active = isServiceable ? 1 : 0;
          await address.save();
        } catch (err) {
          console.error('Delhivery API error:', err.message);
        }
      }

      return res.json({
        status: 'success',
        message: 'Addresses fetched successfully',
        data: addresses,
      });
    } catch (error) {
      console.error('Failed to fetch addresses:', error.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch addresses',
        error: error.message,
      });
    }
  },
  async store(req, res) {
    try {
      const payload = {
        ...req.body,
        user_id: req.user?.id || 1, // fallback to 1 if not authenticated
      };

      const address = await UserAddress.create(payload);

      return res.json({
        status: 'success',
        message: 'Address created successfully',
        data: address,
      });
    } catch (error) {
      console.error('Failed to create address:', error.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create address',
        error: error.message,
      });
    }
  },

  async show(req, res) {
    try {
      const address = await UserAddress.findByPk(req.params.id);
      if (!address || address.user_id !== req.user.id) {
        return res.status(404).json(errorResponse('Address not found'));
      }

      return res.json(successResponse('Address retrieved successfully', address));
    } catch (error) {
      return res.status(500).json(errorResponse('Failed to fetch address', error));
    }
  },

  async update(req, res) {
    try {
      const addressId = parseInt(req.params.id, 10);
      const userId = '1';
      const address = await UserAddress.findByPk(addressId);
      if (!address.id) {
        return errorResponse(res, 'NOT_FOUND', 'Address not found', 404);
      }
      if (address.user_id !== userId) {
        return errorResponse(res, 'FORBIDDEN', 'You are not authorized to update this address', 403);
      }
      await address.update(req.body);
      return successResponse(res, 'Address updated successfully', address);
    } catch (error) {
      return errorResponse(res, 'INTERNAL_ERROR', 'Failed to update address', 500);
    }
  },

  async setActive(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return errorResponse(res, 'UNAUTHORIZED', 'User not authenticated', 401);
      }

      const id = parseInt(req.params.id, 10);
      const address = await UserAddress.findByPk(id);

      if (!address || Number(address.user_id) !== Number(req.user.id)) {
        return errorResponse(res, 'NOT_FOUND', 'Address not found', 404);
      }

      // Set all addresses inactive for the user
      await UserAddress.update({ active: 0 }, { where: { user_id: req.user.id } });

      // Set this address active
      address.active = 1;
      await address.save();

      return successResponse(res, 'Address set as active', address);
    } catch (error) {
      console.error('Failed to set address active:', error);
      return errorResponse(res, 'INTERNAL_ERROR', 'Failed to set address active', 500);
    }
  },



  async getActive(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return errorResponse(res, 'UNAUTHORIZED', 'User not authenticated', 401);
      }

      const userId = req.user.id;
      // Find active address only
      const address = await UserAddress.findOne({ where: { user_id: userId, active: true  } });
      if (!address) {
        return errorResponse(res, 'NOT_FOUND', 'No active address found', 404);
      }

      try {
        const response = await axios.get('https://staging-express.delhivery.com/c/api/pin-codes/json/', {
          headers: { Authorization: 'Token 91b6796b405cff3518be0752768e81fca4d1984a' },
          params: { filter_codes: address.zipcode },
        });

        const isServiceable = Array.isArray(response.data.delivery_codes) && response.data.delivery_codes.length > 0;
        address.active = isServiceable ? 1 : 0;
        await address.save();
      } catch (apiError) {
        console.error('Delhivery API error:', apiError.message);
        address.active = 0;
        await address.save();
      }

      return successResponse(res, 'Active address fetched', address);
    } catch (error) {
      console.error('Failed to get active address:', error);
      return errorResponse(res, 'INTERNAL_ERROR', 'Failed to get active address', 500);
    }
  },


  async destroy(req, res) {
    if (!req.user || !req.user.id) {
      return errorResponse(res, 'UNAUTHORIZED', 'User not authenticated', 401);
    }
    try {
      const ids = req.body.ids || [];

      await UserAddress.destroy({
        where: {
          id: ids,
          user_id: req.user.id,
        },
      });

      return successResponse(res, 'Addresses deleted successfully');
    } catch (error) {
      return errorResponse(res, 'INTERNAL_ERROR', 'Failed to delete address', 500);
    }
  },

};

module.exports = UserAddressController;
