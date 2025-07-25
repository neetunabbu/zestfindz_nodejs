const ProductResource = require('./ProductResource');

function userDigitalFileResource(digitalFile) {
  if (!digitalFile) return null;

  const digitalFileRelation = digitalFile.digitalFile || null;
  const productRelation = digitalFileRelation?.product || null;

  return {
    id: digitalFile.id,
    active: Boolean(digitalFile.active),
    downloaded: Boolean(digitalFile.downloaded),
    digital_file_id: digitalFile.digital_file_id || null,
    user_id: digitalFile.user_id || null,
    created_at: digitalFile.created_at
      ? new Date(digitalFile.created_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,
    updated_at: digitalFile.updated_at
      ? new Date(digitalFile.updated_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,

    digital_file: digitalFileRelation
      ? {
          id: digitalFileRelation.id,
          active: Boolean(digitalFileRelation.active),
          product_id: digitalFileRelation.product_id,
          product: productRelation?.id ? ProductResource(productRelation) : null,
        }
      : {},
  };
}

module.exports = userDigitalFileResource;


