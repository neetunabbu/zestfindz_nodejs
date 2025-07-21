// resources/propertyValueResource.js

const propertyGroupResource = require('./PropertyGroupResource');
const galleryResource = require('./GalleryResource');

function propertyValueResource(propertyValueInstance) {
  if (!propertyValueInstance) return null;

  return {
    id: propertyValueInstance.id ?? undefined,
    img: propertyValueInstance.img ?? undefined,
    extra_group_id: propertyValueInstance.property_group_id ?? undefined,
    value: propertyValueInstance.value ?? undefined,
    active: propertyValueInstance.active ?? undefined,

    // Relations
    group: propertyValueInstance.group
      ? propertyGroupResource(propertyValueInstance.group)
      : null,

    galleries: Array.isArray(propertyValueInstance.galleries)
      ? propertyValueInstance.galleries.map(galleryResource)
      : [],
  };
}

module.exports = propertyValueResource;
