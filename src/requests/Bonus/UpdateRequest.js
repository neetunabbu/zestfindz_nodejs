// D:\zestfindz_nodejs\src\requests\Bonus\UpdateRequest.js

const StoreRequest = require('./StoreRequest');

/**
 * UpdateRequest shares the same rules as StoreRequest
 * (Equivalent to `return (new StoreRequest)->rules();` in Laravel)
 */
const UpdateRequest = [...StoreRequest];

module.exports = UpdateRequest;
