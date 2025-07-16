const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().replace('.000Z', 'Z');
};

const emailTemplateResource = (template) => {
  if (!template) return null;

  return {
    id: template.id,
    email_setting_id: template.email_setting_id,
    subject: template.subject,
    body: template.body,
    alt_body: template.alt_body,
    status: template.status,
    type: template.type,
    send_to: template.send_to
      ? new Date(template.send_to).toISOString().slice(0, 13) + ':00:00Z'
      : null,
    created_at: formatDateTime(template.created_at),
    updated_at: formatDateTime(template.updated_at),

    email_setting: template.email_setting
      ? require('./EmailSettingResource')(template.email_setting)
      : undefined,
  };
};

module.exports = emailTemplateResource;
