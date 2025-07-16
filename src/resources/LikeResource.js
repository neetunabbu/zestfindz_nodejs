// resources/LikeResource.js

const BlogResource = require('./BlogResource');
const ProductResource = require('./ProductResource');
const ShopResource = require('./ShopResource');
const BannerResource = require('./BannerResource');

class LikeResource {
  static toJson(like) {
    const model = like.likable || null;

    if (!model) {
      return {};
    }

    const modelName = model.constructor.name;

    switch (modelName) {
      case 'Blog':
        return BlogResource.toJson(model);

      case 'Product':
        return ProductResource.toJson(model);

      case 'Shop':
        return ShopResource.toJson(model);

      case 'Banner':
        return BannerResource.toJson(model);

      default:
        return {};
    }
  }
}

module.exports = LikeResource;
