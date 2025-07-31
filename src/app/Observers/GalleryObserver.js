const fs = require('fs');
const path = require('path');
const { logError } = require('../../traits/Loggable');
const Gallery = require('../../models/Gallery');

// onDelete function
const onDelete = async (gallery) => {
    try {
        if (gallery && gallery.path) {
            const filePath = path.join(__dirname, '../../public/storage/images/gallery/', gallery.path);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File deleted: ${filePath}`);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        }
    } catch (error) {
        logError('GalleryObserver.js -> onDelete', error);
    }
};

module.exports = {
    onDelete
};
