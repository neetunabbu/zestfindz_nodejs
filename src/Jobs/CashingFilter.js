// src/Jobs/CashingFilter.js

const FilterRepository = require('../Repositories/FilterRepository/FilterRepository');
const Loggable = require('../traits/Loggable');

class CashingFilter {
    constructor(key, filter) {
        this.key = key;
        this.filter = filter;

        // If you need to apply traits like Loggable methods to the instance
        Object.assign(this, Loggable);
    }

    // Simulating the handle method like Laravel's Job handler
    async handle() {
        try {
            const repo = new FilterRepository();
            await repo.cachingFilter(this.key, this.filter);
        } catch (error) {
            console.error(`Error: ${error.message}`, {
                code: error.code || 'N/A',
                line: error.stack
            });
            // If Loggable trait has logging methods, you can use them here
            if (this.logError) {
                this.logError(error.message, error);
            }
        }
    }
}

module.exports = CashingFilter;
