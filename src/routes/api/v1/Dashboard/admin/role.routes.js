// src\routes\api\v1\Dashboard\admin\role.routes.js
const express = require('express');
const router = express.Router();
const roleController = require('../../../../../controllers/Api/v1/dashboard/admin/role.controller.js'); // ✅ Corrected path
const userController = require('../../../../../controllers/Api/v1/dashboard/admin/user.controller.js');
const authMiddleware = require('../../../../../middleware/authMiddleware');

// ✅ Role Middleware
const roleMiddleware = require('../../../../../middleware/roleMiddleware');

// ✅ GET /api/v1/dashboard/admin/roles — admin OR manager only
router.get('/', roleMiddleware('admin|manager'), roleController.index);
router.get('/', authMiddleware, roleMiddleware('admin|manager'), userController.getUsers);
module.exports = router;
