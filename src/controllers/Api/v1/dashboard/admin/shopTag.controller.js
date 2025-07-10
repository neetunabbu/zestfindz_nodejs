// Controller for Admin ShopTag Resource
// Corresponds to Laravel's App\Http\Controllers\API\v1\Dashboard\Admin\ShopTagController

// Import necessary modules/classes
const { ShopTag } = require('../../../../models'); // Assuming ShopTag model is exported from models/index.js
const ShopTagRepository = require('../../../../repositories/shopTag.repository');
const ShopTagService = require('../../../../services/shopTag.service');
const { successResponse, errorResponse, handleServiceResponse } = require('../../../../utils/apiResponse');
const { body, query, param, validationResult } = require('express-validator'); // For validation

const { slugify } = require('../../../../utils/stringUtils'); // Import slugify

// Instantiate repository and service
// In a more complex setup with DI, these would be injected.
// ShopTagRepository is now exported as an instance.
const shopTagRepositoryInstance = ShopTagRepository; 
// ShopTagService is exported as a class, so instantiate it with the repo instance.
const shopTagServiceInstance = new ShopTagService(shopTagRepositoryInstance);

// --- Helper for localization (placeholder) ---
// TODO: Replace with a proper i18n library
const __ = (key, options = {}) => {
    // Example: 'errors.RECORD_WAS_SUCCESSFULLY_CREATED' -> 'Record was successfully created'
    let message = key.substring(key.lastIndexOf('.') + 1).replace(/_/g, ' ').toLowerCase();
    message = message.charAt(0).toUpperCase() + message.slice(1);
    if (options.locale) {
        // console.log(`Locale for message: ${options.locale}`); // Use if needed
    }
    return message;
};
const language = 'en'; // Placeholder for $this->language

// --- Controller Methods ---

// GET / - Display a listing of the resource. (index)
const index = async (req, res) => {
    // TODO: Convert FilterParamsRequest to express-validator or similar
    // For now, assume basic query params: page, perPage, search
    const { page = 1, perPage = 10, search = null, ...otherFilters } = req.query;
    
    try {
        const filterParams = { search, ...otherFilters }; // Pass all query params
        const result = await shopTagRepositoryInstance.paginate(filterParams, parseInt(page), parseInt(perPage));
        
        // Laravel uses API Resources (ShopTagResource::collection).
        // Here, we'll just send the data, or create a similar transformation if needed.
        // A simple transformation:
        const transformedData = result.data.map(tag => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            // Add other fields as needed by ShopTagResource
            created_at: tag.created_at,
            updated_at: tag.updated_at,
        }));

        return successResponse(res, __('messages.DATA_FETCHED_SUCCESSFULLY', { locale: language }), {
            items: transformedData,
            pagination: {
                total: result.total,
                per_page: result.per_page,
                current_page: result.current_page,
                last_page: result.last_page,
            }
        });
    } catch (err) {
        console.error("ShopTagController.index error:", err);
        return errorResponse(res, __('errors.FETCH_FAILED', { locale: language }), 500, err.message);
    }
};

// POST / - Store a newly created resource in storage. (store)
const storeValidationRules = () => [ // Corresponds to StoreRequest
    body('name').notEmpty().withMessage('Name is required').isString().trim(),
    body('slug').optional().isString().trim(), // Or generate from name if not provided
    // Add other validation rules from Laravel StoreRequest if any
];
const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, __('errors.VALIDATION_ERROR', { locale: language }), 422, errors.array());
    }

    const validatedData = req.body; 
    
    // Handle slug generation if not provided
    if (!validatedData.slug && validatedData.name) {
        validatedData.slug = slugify(validatedData.name);
    }

    try {
        const result = await shopTagServiceInstance.create(validatedData);
        return handleServiceResponse(res, result); // Uses the new utility
    } catch (err) {
        console.error("ShopTagController.store error:", err);
        return errorResponse(res, __('errors.CREATE_FAILED', { locale: language }), 500, err.message);
    }
};

// GET /:id - Display the specified resource. (show)
const showValidationRules = () => [
    param('id').isInt({ gt: 0 }).withMessage('Valid ShopTag ID is required'),
];
const show = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, __('errors.VALIDATION_ERROR', { locale: language }), 422, errors.array());
    }

    try {
        // Laravel's route model binding (ShopTag $shopTag) fetches the model.
        // Here, we need to fetch it by ID from params.
        const shopTagId = parseInt(req.params.id);
        const shopTag = await shopTagRepositoryInstance.findById(shopTagId); // Assuming findById in repo

        if (!shopTag) {
            return errorResponse(res, __('errors.RESOURCE_NOT_FOUND', { locale: language }), 404);
        }
        // The repository's show method in Laravel might do more than just return the model.
        // For now, we assume it's fetched and we transform it.
        const resource = shopTag.toJSON ? shopTag.toJSON() : shopTag; // Simple transformation
        return successResponse(res, __('errors.NO_ERROR', { locale: language }), resource);
    } catch (err) {
        console.error("ShopTagController.show error:", err);
        return errorResponse(res, __('errors.FETCH_FAILED', { locale: language }), 500, err.message);
    }
};

// PUT /:id - Update the specified resource in storage. (update)
const updateValidationRules = () => [ // Corresponds to StoreRequest, but for update
    param('id').isInt({ gt: 0 }).withMessage('Valid ShopTag ID is required'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty if provided').isString().trim(),
    body('slug').optional().isString().trim(),
    // Add other validation rules
];
const update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, __('errors.VALIDATION_ERROR', { locale: language }), 422, errors.array());
    }

    const shopTagId = parseInt(req.params.id);
    const validatedData = req.body;

    try {
        // Fetch first to ensure it exists, or let service handle it
        // const shopTag = await shopTagRepositoryInstance.findById(shopTagId);
        // if (!shopTag) {
        //     return errorResponse(res, __('errors.RESOURCE_NOT_FOUND', { locale: language }), 404);
        // }
        // The service update method in Laravel received the ShopTag instance.
        // Pass ID here, service can fetch.
        const result = await shopTagServiceInstance.update(shopTagId, validatedData);
        return handleServiceResponse(res, result);
    } catch (err) {
        console.error("ShopTagController.update error:", err);
        return errorResponse(res, __('errors.UPDATE_FAILED', { locale: language }), 500, err.message);
    }
};

// DELETE / - Remove the specified resources from storage. (destroy)
// Note: Laravel controller took FilterParamsRequest, implying it expected 'ids' in query/body.
const destroyValidationRules = () => [
    // Assuming 'ids' is an array in the request body or query
    // Example: body('ids').isArray({ min: 1 }).withMessage('Array of IDs is required.'),
    // query('ids').custom(value => /* parse and validate CSV or array */)
    // For simplicity, assume 'ids' is a comma-separated string in query or an array in body
];
const destroy = async (req, res) => {
    // Validation for 'ids' should be added here
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) { ... }

    let ids = req.body.ids || req.query.ids;
    if (typeof ids === 'string') {
        ids = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0);
    }
    if (!Array.isArray(ids) || ids.length === 0) {
        return errorResponse(res, __('errors.INVALID_INPUT', { locale: language }), 400, 'IDs must be provided as an array or comma-separated string.');
    }
    
    try {
        const result = await shopTagServiceInstance.delete(ids);
        return handleServiceResponse(res, result);
    } catch (err) {
        console.error("ShopTagController.destroy error:", err);
        return errorResponse(res, __('errors.DELETE_FAILED', { locale: language }), 500, err.message);
    }
};

// DELETE /action/drop-all - (Custom method from Laravel controller)
const dropAll = async (req, res) => {
    try {
        const result = await shopTagServiceInstance.dropAll();
        return handleServiceResponse(res, result);
    } catch (err) {
        console.error("ShopTagController.dropAll error:", err);
        return errorResponse(res, __('errors.DELETE_FAILED', { locale: language }), 500, err.message);
    }
};


module.exports = {
  index,
  store,
  storeValidationRules,
  show,
  showValidationRules,
  update,
  updateValidationRules,
  destroy,
  destroyValidationRules, // Export rules if applied in router
  dropAll,
};
