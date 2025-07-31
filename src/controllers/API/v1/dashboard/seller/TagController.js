// src/controllers/api/v1/dashboard/seller/TagController.js

const ResponseError = require('../../../../../helpers/ResponseError');
const { validateFilterParams } = require('../../../../../requests/FilterParamsRequest');
const { validateStoreTag } = require('../../../../../requests/Tag/StoreRequest');
const { validateUpdateTag } = require('../../../../../requests/Tag/UpdateRequest');
const ShopTagResource = require('../../../../../resources/ShopTagResource');
const TagResource = require('../../../../../resources/TagResource');
const Tag = require('../../../../../models/Tag');
const ShopTagRepository = require('../../../../../repositories/ShopTagRepository/ShopTagRepository');
const TagRepository = require('../../../../../repositories/TagRepository/TagRepository');
const TagService = require('../../../../../services/TagService/TagService');


let shop = null; // this should be set in setupSellerContext middleware and made available in request

const index = async (req, res) => {
    const tag = await req.repositories.tagRepository.paginate({
        ...req.query,
        shop_id: req.shop.id
    });

    return res.json(TagResource.collection(tag));
};

const store = async (req, res) => {
    const validated = req.body;

    const result = await req.services.tagService.create(validated);

    if (!result?.status) {
        return onErrorResponse(res, result);
    }

    return successResponse(res, __(RECORD_WAS_SUCCESSFULLY_CREATED, req.language));
};

const show = async (req, res) => {
    const tag = req.tag; // set by route param middleware or fetched manually

    const tagData = await req.repositories.tagRepository.show(tag);

    return successResponse(res, __(NO_ERROR, req.language), TagResource.make(tagData));
};

const update = async (req, res) => {
    const validated = req.body;

    const result = await req.services.tagService.update(req.tag, validated);

    if (!result?.status) {
        return onErrorResponse(res, result);
    }

    return successResponse(res, __(RECORD_WAS_SUCCESSFULLY_UPDATED, req.language));
};

const destroy = async (req, res) => {
    await req.services.tagService.delete(req.body.ids || [], req.shop.id);

    return successResponse(res, __(RECORD_WAS_SUCCESSFULLY_DELETED, req.language));
};

const shopTagsPaginate = async (req, res) => {
    const models = await req.repositories.shopTagRepository.paginate(req.query);

    return res.json(ShopTagResource.collection(models));
};

module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    shopTagsPaginate
};
