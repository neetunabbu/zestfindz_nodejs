const shopResource = require('./shopResource');

const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const shopWorkingDayResource = (workingDayInstance) => {
  if (!workingDayInstance) return null;

  return {
    id: workingDayInstance.id ?? null,
    day: workingDayInstance.day ?? null,
    from: workingDayInstance.from ?? null,
    to: workingDayInstance.to ?? null,
    disabled: Boolean(workingDayInstance.disabled),
    created_at: formatDate(workingDayInstance.created_at),
    updated_at: formatDate(workingDayInstance.updated_at),

    // Relations
    shop: workingDayInstance.shop
      ? shopResource(workingDayInstance.shop)
      : null,
  };
};

module.exports = shopWorkingDayResource;
