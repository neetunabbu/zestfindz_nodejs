function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const EmailSettingResource = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    smtp_auth: data.smtp_auth,
    smtp_debug: data.smtp_debug,
    host: data.host,
    port: data.port,
    password: data.password,
    from_to: data.from_to,
    from_site: data.from_site,
    active: Boolean(data.active),
    ssl: data.ssl ?? null,
    created_at: formatDateTime(data.created_at),
    updated_at: formatDateTime(data.updated_at),
  };
};

module.exports = EmailSettingResource;
