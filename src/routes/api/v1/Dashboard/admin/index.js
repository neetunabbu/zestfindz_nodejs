// src/routes/api/v1/Dashboard/admin/index.js
import { Router } from 'express';
const router = Router();

router.use('/roles', require('./role.routes'));
router.use('/users', require('./user.routes'));

export default router;
