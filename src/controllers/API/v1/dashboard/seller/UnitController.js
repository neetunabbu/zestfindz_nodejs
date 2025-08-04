const { ResponseError } = require('../../../../../helpers/ResponseError');
const FilterParamsRequest = require('../../../../../requests/FilterParamsRequest');
const UnitResource = require('../../../../../resources/UnitResource');
const UnitRepository = require('../../../../../repositories/UnitRepository/UnitRepository');
const { successResponse, onErrorResponse } = require('../../../../../utils/Response');

// GET /seller/units (with pagination/filtering)
const paginate = async (req, res) => {
    try {
        const filters = req.query;
        const units = await UnitRepository.unitsPaginate(filters);

        return successResponse(res, 'Units fetched successfully', units);
    } catch (error) {
        console.error('Error in paginate:', error);
        return onErrorResponse(res, {
            code: ResponseError.ERROR_500,
            message: error.message || 'Failed to fetch units'
        });
    }
};

// GET /seller/units/:id
const show = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return onErrorResponse(res, {
                code: ResponseError.ERROR_400,
                message: 'Invalid ID parameter'
            });
        }

        const unit = await UnitRepository.unitDetails(id);

        if (!unit) {
            return onErrorResponse(res, {
                code: ResponseError.ERROR_404,
                message: 'Unit not found'
            });
        }

        return successResponse(res, 'Unit fetched successfully', unit);
    } catch (error) {
        console.error('Error in show:', error);
        return onErrorResponse(res, {
            code: ResponseError.ERROR_500,
            message: error.message || 'Failed to fetch unit'
        });
    }
};

module.exports = {
    paginate,
    show
};
