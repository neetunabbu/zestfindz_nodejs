// resources/extraValueResource.js

const extraGroupResource = require('./ExtraGroupResource');
const galleryResource = require('./GalleryResource');

function extraValueResource(extraValueInstance) {
  if (!extraValueInstance) return null;

  return {
    id: parseInt(extraValueInstance.id, 10),
    extra_group_id: parseInt(extraValueInstance.extra_group_id, 10),
    value: String(extraValueInstance.value),
    active: Boolean(extraValueInstance.active),

    // Relations
    group: extraValueInstance.group
      ? extraGroupResource(extraValueInstance.group)
      : null,

    galleries: Array.isArray(extraValueInstance.galleries)
      ? extraValueInstance.galleries.map(galleryResource)
      : [],
  };
}

module.exports = extraValueResource;
