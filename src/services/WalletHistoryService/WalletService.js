// services/walletService.js

const { Wallet } = require('../../models'); // Adjust the path to your models

class WalletService {
  getModelClass() {
    return Wallet;
  }
}

module.exports = WalletService;
