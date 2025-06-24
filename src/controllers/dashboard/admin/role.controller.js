// src/controllers/dashboard/admin/role.controller.js
const Role = require('../../../models/Role');

module.exports = {
    // GET /api/v1/dashboard/admin/roles
    async index(req, res) {
        try {
            // ✅ Log user info for middleware verification
            console.log('RoleController -> Accessed by user:', {
                user_id: req.user?.id,
                roles: req.user?.roles?.map(r => r.name)
            });

            const roles = await Role.findAll();
            return res.status(200).json({
                status: true,
                message: 'Roles fetched successfully.',
                data: roles
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
};
