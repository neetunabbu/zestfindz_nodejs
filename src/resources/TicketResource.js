// resources/ticketResource.js

/**
 * Basic resource that returns the raw object data.
 *
 * @param {Object} ticket - Sequelize model instance or plain object
 * @returns {Object}
 */
function ticketResource(ticket) {
  if (!ticket) return null;

  // Directly return all fields (similar to parent::toArray())
  return {
    ...ticket?.toJSON?.() ?? ticket
  };
}

module.exports = ticketResource;
