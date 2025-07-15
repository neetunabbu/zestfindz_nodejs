// resources/DigitalFileResource.js

function formatDate(date) {
    return date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;
}

function DigitalFileResource(digitalFile, options = {}) {
    if (!digitalFile) return null;

    return {
        id: digitalFile.id,
        active: Boolean(digitalFile.active),
        product_id: digitalFile.product_id ?? undefined,
        path: digitalFile.path ?? undefined,
        created_at: digitalFile.created_at ? formatDate(digitalFile.created_at) : undefined,
        updated_at: digitalFile.updated_at ? formatDate(digitalFile.updated_at) : undefined,

        // Relations (if included via eager loading)
        product: digitalFile.product ? ProductResource(digitalFile.product) : undefined,
        user_digital: digitalFile.userDigital ? UserResource(digitalFile.userDigital) : undefined,
        users_digital: Array.isArray(digitalFile.usersDigital)
            ? digitalFile.usersDigital.map(user => UserResource(user))
            : undefined,
    };
}

module.exports = DigitalFileResource;
