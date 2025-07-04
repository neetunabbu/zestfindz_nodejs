// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // PostgreSQL connection

// // const ModelHasRole = sequelize.define('ModelHasRole', {
// //   role_id: {
// //     type: DataTypes.BIGINT,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   model_type: {
// //     type: DataTypes.STRING(255),
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   model_id: {
// //     type: DataTypes.BIGINT,
// //     allowNull: false,
// //     primaryKey: true
// //   }
// // }, {
// //   tableName: 'model_has_roles',
// //   timestamps: false
// // });

// // models/modelHasRoles.js
// module.exports = (sequelize, DataTypes) => {
//   const ModelHasRoles = sequelize.define('ModelHasRoles', {
//     role_id: {
//       type: DataTypes.BIGINT,
//       primaryKey: true
//     },
//     model_type: {
//       type: DataTypes.STRING,
//       primaryKey: true
//     },
//     model_id: {
//       type: DataTypes.BIGINT,
//       primaryKey: true
//     }
//   }, {
//     tableName: 'model_has_roles',
//     timestamps: false
//   });

//   return ModelHasRoles;
// };


// // Index creation (optional if you haven’t already)
// sequelize.query(`
//   CREATE INDEX IF NOT EXISTS model_has_roles_model_id_model_type_index
//   ON model_has_roles (model_id, model_type);
// `);

// // No relationships are defined here because this is a pivot table, but if you wanted,
// // you could link it to Role and User models as associations in their respective models.

// module.exports = ModelHasRole;
// src/models/modelHasRole.js

// src/models/modelHasRole.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ModelHasRole', {
    role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    model_type: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    model_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    }
  }, {
    tableName: 'model_has_roles',
    timestamps: false
  });
};

