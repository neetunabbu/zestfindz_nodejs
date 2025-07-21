const storeRequest = require('./StoreRequest');

// Clone the storeRequest array and remove the user_id validation
const userStoreRequest = storeRequest.filter(rule => {
  const path = rule.builder.fields[0]; // get the field name like 'user_id'
  return path !== 'user_id';
});

module.exports = userStoreRequest;
