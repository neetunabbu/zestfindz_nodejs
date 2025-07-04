// const User = require('../models/User');

// module.exports = {
//     async paginateUsers() {
//         return await User.findAll();
//     },

//     async createUser(data) {
//         return await User.create(data);
//     },

//     async findUserByUUID(uuid) {
//         return await User.findOne({ where: { uuid } });
//     },

//     async updateUser(uuid, data) {
//         const user = await User.findOne({ where: { uuid } });
//         if (!user) return null;
//         await user.update(data);
//         return user;
//     },

//     async deleteUsers(uuids) {
//         // Change from id: ids to uuid: uuids
//         return await User.destroy({ where: { uuid: uuids } });
//     }
// };

// ✅ user.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const generateToken = require('../utils/generateToken');

const paginateUsers = async () => {
  return await User.findAll();
};

const createUser = async (data) => {
  const existingUserByEmail = await User.findOne({ where: { email: data.email } });
  if (existingUserByEmail) {
    return { status: false, success: false, message: 'Email already exists.' };
  }
  if (data.phone) {
    const existingUserByPhone = await User.findOne({ where: { phone: String(data.phone).replace(/\D/g, '') } });
    if (existingUserByPhone) {
      return { status: false, success: false, message: 'Phone already exists.' };
    }
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
//   const defaultRole = await Role.findOne({ where: { name: 'user' } });
// if (defaultRole) {
//   await ModelHasRole.create({
//     role_id: defaultRole.id,
//     model_type: 'User',
//     model_id: user.id,
//   });
// }

  const user = await User.create({ ...data, password: hashedPassword,
  //    roles: [defaultRole] }, {
  //   include: [{ model: Role, as: 'roles' }]
  }
);
  return { status: true, success: true, data: user };
};

const findUserByUUID = async (uuid) => {
  return await User.findOne({ where: { uuid } });
};

const updateUser = async (uuid, data) => {
  const user = await User.findOne({ where: { uuid } });
  if (!user) return null;
  await user.update(data);
  return user;
};

const deleteUsers = async (uuids) => {
  return await User.destroy({ where: { uuid: uuids } });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email }, include: [{ model: db.Role, as: 'roles' }] });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return {
    ...user.get(),
    token: generateToken(user.id)
  };
};

const getAllUsers = async () => {
  return User.scope('filter').findAll();
};

module.exports = {
  register: createUser,
  login,
  getAllUsers,
  paginateUsers,
  createUser,
  findUserByUUID,
  updateUser,
  deleteUsers
};
// Note: Ensure that the User model is properly defined with necessary fields and associations.