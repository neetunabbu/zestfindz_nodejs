const { successResponse } = require('../../../../../Traits/ApiResponse');
const AdsPackageResource = require('../../../../../resources/AdsPackageResource');
const ResponseError = require('../../../../../helpers/ResponseError');
const adsPackageRepository = require('../../../../../repositories/AdsPackageRepository/AdsPackageRepository');

const index = async (req, res, next) => {
  try {
    const models = await adsPackageRepository.paginate(req.query);
    const resource = AdsPackageResource.collection(models);
    return res.json(resource);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const adsPackage = req.adsPackage; // populated by route param middleware
    const model = await adsPackageRepository.show(adsPackage);
    const resource = AdsPackageResource.make(model);

    return successResponse(res, {
      message: req.t(`errors.${ResponseError.NO_ERROR}`),
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  index,
  show,
};
