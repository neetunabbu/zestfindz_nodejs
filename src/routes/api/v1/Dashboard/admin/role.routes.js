// src\routes\api\v1\Dashboard\admin\role.routes.js
const express = require('express');
const router = express.Router();
const roleController = require('../../../../../controllers/dashboard/admin/role.controller');

// ✅ Role Middleware
const roleMiddleware = require('../../../../../middleware/roleMiddleware');

// ✅ GET /api/v1/dashboard/admin/roles — admin OR manager only
router.get('/', roleMiddleware('admin|manager'), roleController.index);

module.exports = router;
