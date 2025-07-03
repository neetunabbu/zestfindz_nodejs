// module.exports = (requiredRoles = []) => {
//   return async (req, res, next) => {
//     try {
//       const user = req.user;

//       console.info('🔐 RoleMiddleware invoked', {
//         user_id: user?.id,
//         required_roles: requiredRoles,
//         request_path: req.path,
//       });

//       const rolesToCheck = Array.isArray(requiredRoles)
//         ? requiredRoles.map(String)
//         : String(requiredRoles).split('|');

//       if (!user || !Array.isArray(user.roles)) {
//         console.warn('🚫 Access denied: user or roles not found.');
//         return res.status(403).json({
//           code: 'ERROR_101',
//           message: 'You do not have permission to access this resource.',
//         });
//       }

//       const userRoleNames = user.roles.map(r => typeof r === 'string' ? r : r.name);

//       const hasRole = userRoleNames.some(role =>
//         rolesToCheck.includes(role) || role === 'admin'
//       );

//       if (hasRole) {
//         console.info('✅ RoleMiddleware access granted', {
//           user_id: user.id,
//           roles_checked: rolesToCheck,
//         });
//         return next();
//       }

//       console.warn('⛔ RoleMiddleware access denied', {
//         user_id: user.id,
//         roles_checked: rolesToCheck,
//         user_roles: userRoleNames
//       });

//       return res.status(403).json({
//         code: 'ERROR_101',
//         message: 'You do not have permission to access this resource.',
//       });
//     } catch (error) {
//       console.error('❌ RoleMiddleware error:', error);
//       return res.status(500).json({
//         code: 'ERROR_INTERNAL',
//         message: 'Internal server error',
//       });
//     }
//   };
// };
module.exports = (requiredRoles = []) => {
  return async (req, res, next) => {
    // TEMP: Allow all authenticated users, skip role checks
    return next();
  };
};
