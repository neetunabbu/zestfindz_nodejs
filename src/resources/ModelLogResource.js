const { userResource } = require('./userResource');
const { modelLogDataResource } = require('./ModelLogDataResource');

function modelLogResource(log) {
  return {
    id: log.id ?? null,
    model_type: log.model_type ?? null,
    model_id: log.model_id ?? null,
    data: log.data ? modelLogDataResource(log.data) : null,
    type: log.type ?? null,
    created_at: log.created_at ? new Date(log.created_at).toISOString() : null,
    created_by: log.created_by ?? null,
    created_user: log.createdBy ? userResource(log.createdBy) : null,
  };
}

module.exports = { modelLogResource };
