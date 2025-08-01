const { Wallet, WalletHistory, Currency, User } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../Traits/Loggable');

class UserWalletService {
  async create(user) {
    try {
      const defaultCurrency = await Currency.findOne({ where: { default: 1 } });
      
      await Wallet.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          uuid: uuidv4(),
          user_id: user.id,
          currency_id: defaultCurrency?.id,
          price: 0
        }
      });

      return await User.findByPk(user.id, { include: ['wallet'] });
    } catch (error) {
      logger.error('Wallet creation error:', error);
      throw error; // Let the controller handle the response
    }
  }

  async update(user, data) {
    const transaction = await sequelize.transaction();
    
    try {
      const price = (user.wallet?.price || 0) + (data.price || 0);
      const currencyId = data.currency || user.wallet?.currency_id;

      const [wallet] = await Wallet.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          uuid: uuidv4(),
          user_id: user.id,
          currency_id: currencyId,
          price: price
        },
        transaction
      });

      if (!wallet.isNewRecord) {
        await wallet.update({ 
          price: price,
          currency_id: currencyId
        }, { transaction });
      }

      await this.historyCreate(wallet, data, transaction);

      await transaction.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await User.findByPk(user.id, { 
          include: ['wallet'],
          transaction 
        })
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Wallet update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: 'Wallet update failed'
      };
    }
  }

  async historyCreate(wallet, data, transaction = null) {
    const authUserId = req.user?.id; // Assuming user is attached to request
    
    try {
      await WalletHistory.create({
        uuid: uuidv4(),
        wallet_id: wallet.id,
        transaction_id: data.transaction_id,
        type: data.type || 'topup',
        price: data.price || 0,
        note: data.note,
        created_by: authUserId
      }, { transaction });
    } catch (error) {
      logger.error('Wallet history creation error:', error);
      throw error; // Let the calling method handle it
    }
  }
}

module.exports = new UserWalletService();