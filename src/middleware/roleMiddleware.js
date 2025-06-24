// src/middleware/roleMiddleware.js

module.exports = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // user must be attached in earlier auth middleware

      console.info('🔐 RoleMiddleware invoked', {
        user_id: user?.id,
        required_roles: requiredRoles,
        request_path: req.path,
      });

      const rolesToCheck = Array.isArray(requiredRoles)
        ? requiredRoles.map(String)
        : String(requiredRoles).split('|');

      // Ensure user exists and has roles
      if (!user || !Array.isArray(user.roles)) {
        console.warn('🚫 Access denied: user or roles not found.');
        return res.status(403).json({
          code: 'ERROR_101',
          message: 'You do not have permission to access this resource.',
        });
      }

      const hasRole = user.roles.some(role =>
        rolesToCheck.includes(role?.name) || role?.name === 'admin'
      );

      if (hasRole) {
        console.info('✅ RoleMiddleware access granted', {
          user_id: user.id,
          roles_checked: rolesToCheck,
        });
        return next();
      }

      console.warn('⛔ RoleMiddleware access denied', {
        user_id: user.id,
        roles_checked: rolesToCheck,
        user_roles: user.roles.map(r => r.name)
      });

      return res.status(403).json({
        code: 'ERROR_101',
        message: 'You do not have permission to access this resource.',
      });
    } catch (error) {
      console.error('❌ RoleMiddleware error:', error);
      return res.status(500).json({
        code: 'ERROR_INTERNAL',
        message: 'Internal server error',
      });
    }
  };
};
