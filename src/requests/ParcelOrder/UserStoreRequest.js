// D:\zestfindz_nodejs\src\requests\ParcelOrder\UserStoreRequest.js

const StoreRequest = require('./StoreRequest');

function UserStoreRequest(req) {
    const rules = StoreRequest(req);

    // Remove 'user_id' validation rule
    delete rules.user_id;

    return rules;
}

module.exports = UserStoreRequest;
