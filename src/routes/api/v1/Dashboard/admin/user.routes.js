// src/routes/api/v1/Dashboard/admin/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../../../../../controllers/dashboard/admin/user.controller.js');
const authMiddleware = require('../../../../../middleware/authMiddleware');
const roleMiddleware = require('../../../../../middleware/roleMiddleware');

// ✅ Apply auth + role middleware only once
router.get('/', authMiddleware, roleMiddleware('admin|manager'), userController.getUsers);

router.post('/', authMiddleware, userController.createUser);
router.get('/:uuid', authMiddleware, userController.getUserByUUID);
router.put('/:uuid', authMiddleware, userController.updateUser);
router.delete('/', authMiddleware, userController.deleteUsers);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../../../../../controllers/dashboard/admin/user.controller');
// const roleController = require('../../../../../controllers/dashboard/admin/role.controller'); // ✅ Corrected path

// // 📂 Users Routes (Converted from Laravel)

// // Search Users
// router.get('/search', userController.usersSearch);

// // Paginate Users
// router.get('/paginate', userController.paginate);

// // Drop All Users
// router.get('/drop/all', userController.dropAll);

// // Update User Role
// router.post('/:uuid/role/update', userController.updateRole);

// // Get Wallet Histories
// router.get('/:uuid/wallets/history', userController.walletHistories);

// // Top-up Wallet
// router.post('/:uuid/wallets', userController.topUpWallet);

// // Set Active/Inactive
// router.post('/:uuid/active', userController.setActive);

// // Update Password
// router.post('/:uuid/password', userController.passwordUpdate);

// // Login as User
// router.get('/:uuid/login-as', userController.loginAsUser);

// // CRUD APIs (Index, Create, Show, Update)
// router.get('/', userController.paginate); // Index route
// router.post('/', userController.store);
// router.get('/:uuid', userController.show);
// router.put('/:uuid', userController.update);

// // Delete Specific Users (bulk delete)
// router.delete('/delete', userController.destroy);

// // Delete Specific Users
// router.delete('/:uuid', userController.destroy);

// // Roles List (Assumed simple GET call)
// router.get('/roles', roleController.listRoles); // You can change the method name

// module.exports = router;
