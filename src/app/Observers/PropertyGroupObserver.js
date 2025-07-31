'use strict';

const PropertyGroup = require('../../models/PropertyGroup');
const { logError } = require('../../traits/Loggable');

// Handle the "deleted" event of PropertyGroup
async function onPropertyGroupDeleted(propertyGroup) {
    try {
        // Uncomment below lines when relations are set in mongoose or sequelize
        // await propertyGroup.propertyValues().deleteMany();
        // await propertyGroup.translations().deleteMany();
    } catch (error) {
        logError('PropertyGroupObserver.onDeleted', error);
    }
}

module.exports = {
    onPropertyGroupDeleted,
};
