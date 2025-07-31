// File: src/app/Observers/UserCartObserver.js

const { v4: uuidv4 } = require('uuid');
const ModelLogService = require('../../services/ModelLogService/ModelLogService');
const { UserCart } = require('../../models/UserCart');

// Handle the "creating" event
const creating = async (userCart) => {
    userCart.uuid = uuidv4();
};

// Handle the "created" event
const created = async (userCart) => {
    // await new ModelLogService().logging(userCart, userCart, 'created');
};

// Handle the "updated" event
const updated = async (userCart) => {
    // await new ModelLogService().logging(userCart, userCart, 'updated');
};

// Handle the "deleted" event
const deleted = async (userCart) => {
    // await new ModelLogService().logging(userCart, userCart, 'deleted');
};

// Handle the "restored" event
const restored = async (userCart) => {
    // await new ModelLogService().logging(userCart, userCart, 'restored');
};

module.exports = {
    creating,
    created,
    updated,
    deleted,
    restored,
};
