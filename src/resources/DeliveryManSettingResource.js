// resources/DeliveryManSettingResource.js

const UserResource = require('./UserResource');
const GalleryResource = require('./GalleryResource');
const RegionResource = require('./RegionResource');
const CountryResource = require('./CountryResource');
const CityResource = require('./CityResource');
const AreaResource = require('./AreaResource');

function formatDateTime(date) {
    return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const DeliveryManSettingResource = (data) => {
    if (!data) return null;

    return {
        id: data.id,
        user_id: data.user_id,
        type_of_technique: data.type_of_technique,
        brand: data.brand,
        model: data.model,
        number: data.number,
        color: data.color,
        online: Boolean(data.online),
        location: data.location,
        created_at: formatDateTime(data.created_at),
        updated_at: formatDateTime(data.updated_at),

        // Relations
        deliveryman: data.deliveryman ? UserResource(data.deliveryman) : null,
        galleries: Array.isArray(data.galleries)
            ? data.galleries.map(GalleryResource)
            : [],
        region: data.region ? RegionResource(data.region) : null,
        country: data.country ? CountryResource(data.country) : null,
        city: data.city ? CityResource(data.city) : null,
        area: data.area ? AreaResource(data.area) : null,
    };
};

module.exports = DeliveryManSettingResource;


