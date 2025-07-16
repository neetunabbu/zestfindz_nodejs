// resources/BackupResource.js

const UserResource = require('./UserResource');

class BackupResource {
  static toJSON(backup) {
    if (!backup) return null;

    return {
      id: backup.id,
      title: backup.title,
      status: backup.status,
      path: '/storage/nodejs-backup/',
      created_at: backup.created_at
        ? backup.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      user: backup.user ? UserResource.toJSON(backup.user) : null,
    };
  }
}

module.exports = BackupResource;
