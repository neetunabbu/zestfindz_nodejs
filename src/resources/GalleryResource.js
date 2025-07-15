require('dotenv').config();

const galleryResource = (gallery) => {
    return {
        id: parseInt(gallery.id),
        title: String(gallery.title),
        type: gallery.type ? String(gallery.type) : undefined,
        loadable_type: gallery.loadable_type ? String(gallery.loadable_type) : undefined,
        loadable_id: gallery.loadable_id ? parseInt(gallery.loadable_id) : undefined,
        path: String(gallery.path),
        preview: gallery.preview || undefined,
        isset: gallery.isset !== undefined ? Boolean(gallery.isset) : false,
        loadable: gallery.loadable || undefined,
        base_path: process.env.IMG_HOST || '',
    };
};

module.exports = galleryResource;
