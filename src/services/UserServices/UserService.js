const { User, Notification, WalletHistory, Transaction, Invitation } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const bcrypt = require('bcrypt');
const { sequelize } = require('../../config/db');
const UserWalletService = require('./UserWalletService');
const logger = require('../../Traits/Loggable');

class UserService {
  async create(data) {
    const transaction = await sequelize.transaction();
    
    try {
      const userData = {
        ...data,
        password: bcrypt.hashSync(data.password || 'password', 10),
        ip_address: req.ip
      };

      if (data.phone) {
        userData.phone = data.phone.replace(/\D/g, '');
      }

      if (data.firebase_token) {
        userData.firebase_token = Array.isArray(data.firebase_token) ? 
          data.firebase_token : [data.firebase_token];
      }

      const user = await User.create(userData, { transaction });

      if (data.images?.[0]) {
        await user.update({ img: data.images[0] }, { transaction });
        // Assuming you have a method to handle uploads
        await user.uploadImages(data.images, { transaction });
      }

      await user.setRoles(data.role || 'user', { transaction });

      if (['moderator', 'deliveryman'].includes(data.role) && data.shop_id) {
        const invitations = data.shop_id.map(shopId => ({
          shop_id: shopId,
          role: data.role,
          status: 2,
          user_id: user.id
        }));
        await Invitation.bulkCreate(invitations, { transaction });
      }

      await this.notificationSync(user, transaction);

      await user.createEmailSubscription(
        { active: true },
        { transaction }
      );

      const userWallet = await new UserWalletService().create(user, transaction);

      await transaction.commit();

      const result = await User.findByPk(user.id, {
        include: ['invitations', 'roles'],
        transaction
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('User creation error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async notificationSync(user, transaction) {
    const notification = await Notification.findOne({
      where: { type: 'PUSH' },
      attributes: ['id', 'type'],
      transaction
    });

    if (notification) {
      await user.addNotification(notification, { transaction });
    } else {
      await user.setNotifications([], { transaction });
    }
  }

  async update(uuid, data, authUser) {
    const where = { uuid };
    
    if (!authUser.roles.includes('admin') && 
        authUser.roles.includes('seller') && 
        data.shop_id) {
      where['$invitations.shop_id$'] = data.shop_id;
    }

    const user = await User.findOne({
      where,
      include: [{
        association: 'invitations',
        attributes: []
      }]
    });

    if (!user) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    const transaction = await sequelize.transaction();
    
    try {
      const updateData = { ...data };

      if (data.password) {
        updateData.password = bcrypt.hashSync(data.password, 10);
      }

      if (data.firebase_token) {
        const tokens = Array.isArray(user.firebase_token) ? 
          user.firebase_token : [user.firebase_token];
        tokens.push(data.firebase_token);
        updateData.firebase_token = tokens;
      }

      if (data.phone) {
        updateData.phone = data.phone.replace(/\D/g, '');
      }

      await user.update(updateData, { transaction });

      if (data.subscribe !== undefined) {
        await user.createEmailSubscription(
          { active: !!data.subscribe },
          { transaction, upsert: true }
        );
      }

      if (data.notifications) {
        await user.setNotifications(data.notifications, { transaction });
      }

      if (data.images?.[0]) {
        await user.update({ img: data.images[0] }, { transaction });
        await user.uploadImages(data.images, { transaction });
      }

      if (data.role) {
        await user.setRoles(data.role, { transaction });

        if (['moderator', 'deliveryman'].includes(data.role) && data.shop_id) {
          await Invitation.destroy({ 
            where: { user_id: user.id },
            transaction 
          });

          const invitations = data.shop_id.map(shopId => ({
            shop_id: shopId,
            role: data.role,
            status: 2,
            user_id: user.id
          }));
          await Invitation.bulkCreate(invitations, { transaction });
        }
      }

      await transaction.commit();

      const result = await User.findByPk(user.id, {
        include: ['emailSubscription', 'notifications', 'invitations', 'roles', 'wallet']
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('User update error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async updatePassword(uuid, password) {
    const user = await User.findOne({ where: { uuid } });
    if (!user) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    try {
      await user.update({ password: bcrypt.hashSync(password, 10) });
      return { status: true, code: ResponseError.NO_ERROR, data: user };
    } catch (error) {
      logger.error('Password update error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async loginAsUser(uuid) {
    const user = await User.findOne({ where: { uuid } });
    if (!user) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    try {
      const token = user.generateToken(); // Assuming you have a method to generate tokens
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: {
          access_token: token,
          token_type: 'Bearer',
          user: await user.withWallet() // Assuming you have a method to load wallet
        }
      };
    } catch (error) {
      logger.error('Login as user error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async updateNotifications(data, authUser) {
    try {
      await sequelize.query(
        'DELETE FROM notification_user WHERE user_id = ?',
        { replacements: [authUser.id] }
      );

      if (data.notifications) {
        await authUser.setNotifications(data.notifications);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await authUser.withNotifications()
      };
    } catch (error) {
      logger.error('Notifications update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: 'Cannot update notifications'
      };
    }
  }

  async updateCurrency(currencyId, authUser) {
    try {
      await authUser.update({ currency_id: currencyId });
      return { status: true, code: ResponseError.NO_ERROR, data: authUser };
    } catch (error) {
      logger.error('Currency update error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async updateLang(lang, authUser) {
    try {
      await authUser.update({ lang });
      return { status: true, code: ResponseError.NO_ERROR, data: authUser };
    } catch (error) {
      logger.error('Language update error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400, 
        message: error.message
      };
    }
  }

  async delete(ids = []) {
    const transaction = await sequelize.transaction();
    
    try {
      const users = await User.findAll({
        where: { id: ids },
        include: ['wallet', 'transactions'],
        transaction
      });

      await Promise.all(users.map(async user => {
        await sequelize.query(
          'DELETE FROM wallet_histories WHERE created_by = ?',
          { replacements: [user.id], transaction }
        );
        
        if (user.wallet) {
          await WalletHistory.destroy({ 
            where: { wallet_id: user.wallet.id },
            transaction
          });
          await user.wallet.destroy({ transaction });
        }

        await Transaction.destroy({ 
          where: { user_id: user.id },
          transaction 
        });

        await user.destroy({ transaction });
      }));

      await transaction.commit();
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      await transaction.rollback();
      logger.error('User deletion error:', error);
      return {
        status: false, 
        code: ResponseError.ERROR_400
      };
    }
  }

  async firebaseTokenUpdate(firebaseToken, authUser) {
    if (!firebaseToken) {
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: 'Token is empty'
      };
    }

    try {
      const tokens = Array.isArray(authUser.firebase_token) ? 
        authUser.firebase_token : 
        [authUser.firebase_token].filter(Boolean);
      
      tokens.push(firebaseToken);
      
      await authUser.update({ 
        firebase_token: [...new Set(tokens)] 
      });
      
      return { status: true };
    } catch (error) {
      logger.error('Firebase token update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message
      };
    }
  }

  async setActive(user) {
    await user.update({ active: !user.active });
  }
}

module.exports = new UserService();