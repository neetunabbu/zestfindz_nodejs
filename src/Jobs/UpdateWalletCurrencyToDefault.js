// src/Jobs/UpdateWalletCurrencyToDefault.js

const db = require('../config/db'); // adjust path to your DB connection
const { Currency } = require('../models/Currency');
const { Loggable } = require('../traits/Loggable');
const logger = require('../utils/logger'); // Assuming you have a custom logger or use console

class UpdateWalletCurrencyToDefault {
    /**
     * Constructor to receive the Currency object
     * @param {Object} currency
     */
    constructor(currency) {
        this.currency = currency;
    }

    /**
     * This function will be used to update all wallets with the default currency
     */
    async handle() {
        try {
            // Update all rows in 'wallets' table with the given currency ID
            await db('wallets').update({ currency_id: this.currency.id });
        } catch (error) {
            // Log error with message, code and line
            logger.error('Wallet currency update failed', {
                message: error.message,
                code: error.code || null,
                stack: error.stack,
            });
        }
    }
}

module.exports = UpdateWalletCurrencyToDefault;
