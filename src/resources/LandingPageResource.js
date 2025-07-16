// resources/LandingPageResource.js

const moment = require('moment');
const GalleryResource = require('./GalleryResource');

class LandingPageResource {
  static toJson(landingPage, options = {}) {
    const includeGalleries = options.includeGalleries ?? false;

    return {
      id: landingPage.id,
      type: landingPage.type,
      data: landingPage.data,
      created_at: landingPage.createdAt 
        ? moment(landingPage.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z' 
        : null,
      updated_at: landingPage.updatedAt 
        ? moment(landingPage.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z' 
        : null,

      galleries: includeGalleries && landingPage.galleries
        ? landingPage.galleries.map(gallery => GalleryResource.toJson(gallery))
        : undefined,
    };
  }
}

module.exports = LandingPageResource;
