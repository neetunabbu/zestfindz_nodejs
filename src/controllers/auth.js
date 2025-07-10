const bcrypt = require('bcryptjs');
const { sequelize,User, Role ,Shop, Wallet, ModelHasRole} = require('../models'); 
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
function ensureSession(req, res, next) {
  if (!req.session) req.session = {};
  next();
}

module.exports = {
  ensureSession,

  async register(req, res) {
    const t = await sequelize.transaction();

    try {
      const { firstname, lastname, email, phone, password } = req.body;

      if (!firstname || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await User.findOne({ where: { email }, transaction: t });
      if (existing) {
        await t.rollback();
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        uuid: uuidv4(),
        firstname,
        lastname,
        email,
        phone,
        password: hashed
      }, { transaction: t });

      await Wallet.create({
        uuid: uuidv4(),
        user_id: user.id,
        price: 0,
        currency_id: 2,
        symbol: '₹', 
      }, { transaction: t });

      await ModelHasRole.create({
        role_id: 1,
        model_type: 'App\Models\User',
        model_id: user.id,
      }, { transaction: t });

      await t.commit();

      req.session.userId = user.id;
      res.json({
        message: 'Registered successfully',
        user: { id: user.id, email: user.email }
      });

    } catch (err) {
      await t.rollback();
      res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body.body;

      console.log("..................",req.body.body);
      console.log(email,password);
      

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials (email not found)' });
      }

      // If passwords are hashed:
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
      }

      // === JWT Token ===
      const tokenPayload = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roles: user.roles?.map(role => role.name) || [],
      };

      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      });

      // === Get Shop Info ===
      const shop = await Shop.findOne({ where: { user_id: user.id } });
      const shopData = shop
        ? {
            id: shop.id,
            is_delhivery_enabled: shop.is_delhivery_enabled,
            is_xpressbees_enabled: shop.is_xpressbees_enabled,
            is_own_delivery_enabled: shop.is_own_delivery_enabled,
            user_id: shop.user_id,
            open: shop.open,
            visibility: shop.visibility,
            verify: shop.verify,
            products_count: shop.products_count,
            seller_documents: shop.seller_documents,
            user_documents_auto_verification: shop.user_documents_auto_verification,
            locales: ['en'],
          }
        : {};

      // === Get Wallet Info ===
      const wallet = await Wallet.findOne({ where: { user_id: user.id } });
      const walletData = wallet
        ? {
            id: wallet.id,
            uuid: wallet.uuid,
            user_id: wallet.user_id,
            price: wallet.price,
            symbol: wallet.symbol,
            created_at: wallet.created_at,
            updated_at: wallet.updated_at,
          }
        : {};

      const modelRole = await ModelHasRole.findOne({ where: { model_id: user.id } });
      let roleName = 'no role';
      let rolePermissions = null;

      if (modelRole) {
        const role = await Role.findOne({ where: { id: modelRole.role_id } });
        if (role) {
          roleName = role.name;
          rolePermissions = role.route_permissions || null;
        }
      }

      return res.json({
        timestamp: new Date().toISOString(),
        status: true,
        message: 'Login successful',
        data: {
          token: token,
          access_token: token,
          token_type: 'Bearer',  
          user: {
            id: Number(user.id),
            uuid: user.uuid,
            firstname: user.firstname,
            lastname: user.lastname,
            empty_p: user.empty_p,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            gender: user.gender,
            active: user.active,
            my_referral: user.my_referral,
            role: "roleName",
            role_permissions: rolePermissions,
            email_verified_at: user.email_verified_at,
            registered_at: user.registered_at,
            r_count: user.r_count,
            r_avg: user.r_avg,
            r_sum: user.r_sum,
            o_count: user.o_count,
            o_sum: user.o_sum,
            created_at: user.created_at,
            updated_at: user.updated_at,
            shop: shopData,
            wallet: walletData,
            model: null,
          },
        }
      });

    } catch (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
  },



  me(req, res) {
    if (!req.session || !req.session.userId) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ message: 'You are authenticated', userId: req.session.userId });
  }
};
