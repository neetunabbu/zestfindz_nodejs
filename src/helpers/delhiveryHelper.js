const { ShopLocation, Shop, User } = require('../models');
const DelhiveryService = require('../services/delhivery');
const config = require('../config/delhivery'); // Make sure this is imported

const syncDelhiveryWarehouse = async (shopLocationId, shopId) => {
  try {
    const shopLocation = await ShopLocation.findByPk(shopLocationId);
    if (!shopLocation) {
      throw new Error('Shop location not found');
    }

    const shop = await Shop.findByPk(shopId, {
      include: [{ model: User, as: 'seller' }]
    });

    if (!shop || !shop.seller) {
      throw new Error('Shop or seller not found');
    }

    const seller = shop.seller;
    const shopName = `${seller.firstname} ${seller.lastname}`;

    // Prepare warehouse data
    const warehouseData = {
      phone: seller.phone,
      city: shopLocation.city,
      name: shopName,
      pin: shopLocation.zipcode,
      address: shopLocation.location,
      country: "India",
      email: seller.email,
      registered_name: shopName,
      return_address: shopLocation.location,
      return_pin: shopLocation.zipcode,
      return_city: shopLocation.city,
      return_state: shopLocation.state,
      return_country: "India",
      state: shopLocation.state,
      is_return_center: true,
      is_fulfillment_center: true
    };

    console.log('Warehouse Data:', JSON.stringify(warehouseData, null, 2));

    const delhivery = DelhiveryService;
    let response;

    try {
      response = await delhivery.createWarehouse(warehouseData);
      console.log('Create response:', JSON.stringify(response, null, 2));

      if (response.success) {
        await shopLocation.update({
          warehouse: response,
          warehouse_address: response.data?.address || warehouseData.address,
          warehouse_city: response.data?.city || warehouseData.city,
          warehouse_country: response.data?.country || warehouseData.country,
          warehouse_name: response.data?.name || warehouseData.name,
          warehouse_phone: response.data?.phone || warehouseData.phone,
          warehouse_zipcode: response.data?.pin || warehouseData.pin,
        });

        return {
          success: true,
          message: 'Warehouse created successfully',
          data: response
        };
      }

      throw new Error(response.error?.join(', ') || 'Unknown error');

    } catch (apiError) {
      const rawError = apiError.response?.data?.error || [];
      const errorMessage = Array.isArray(rawError)
        ? rawError.join(' ')
        : String(rawError);

      console.log('Caught API Error:', errorMessage);

      const needsAddressFix = errorMessage.toLowerCase().includes('must be a');

      if (needsAddressFix) {

        
        const messageToUser =
          'The address provided seems invalid or incomplete. Please include a proper street address and mention a nearby famous location such as a landmark, bus stop, or well-known area name.';

        return {
          success: false,
          message: messageToUser,
          error: apiError.response?.data,
        };
      }


      const warehouseExists = errorMessage.includes('already exists') ||
                              errorMessage.includes('CLIENT_STORES_CREATE');

      if (warehouseExists) {
        console.log('Warehouse already exists, attempting to edit...');

        try {
          const editResponse = await delhivery.editWarehouse({
            ...warehouseData,
            client_name: config.client,
            phone: warehouseData.phone,
            email: warehouseData.email,
          });

          console.log('Edit response:', JSON.stringify(editResponse, null, 2));

          if (!editResponse.success) {
            throw new Error(editResponse.error?.join(', ') || 'Edit failed');
          }

          await shopLocation.update({
            warehouse: JSON.stringify(editResponse),
            warehouse_address: editResponse.data?.address || warehouseData.address,
            warehouse_city: editResponse.data?.city || warehouseData.city,
            warehouse_country: editResponse.data?.country || warehouseData.country,
            warehouse_name: editResponse.data?.name || warehouseData.name,
            warehouse_phone: editResponse.data?.phone || warehouseData.phone,
            warehouse_zipcode: editResponse.data?.pin || warehouseData.pin,
          });

          return {
            success: true,
            message: 'Warehouse edited successfully',
            data: editResponse
          };

        } catch (editErr) {
          console.error('Edit Error:', editErr.message);
          return {
            success: false,
            message: `Failed to edit warehouse: ${editErr.message}`,
            error: editErr
          };
        }
      }

      return {
        success: false,
        message: `Delhivery API Error: ${errorMessage}`,
        error: apiError.response?.data || apiError
      };
    }


  } catch (err) {
    console.error('Error syncing warehouse:', err);
    return { 
      success: false, 
      message: err.message,
      error: err.response?.data || err 
    };
  }
};

module.exports = { syncDelhiveryWarehouse };