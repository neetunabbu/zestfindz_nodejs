function paymentResource(payment) {
  const result = {
    id: parseInt(payment.id),
    tag: String(payment.tag),
    active: Boolean(payment.active),
  };

  if (payment.input !== null && payment.input !== undefined) {
    result.input = parseInt(payment.input);
  }

  if (payment.sandbox !== null && payment.sandbox !== undefined) {
    result.sandbox = Boolean(payment.sandbox);
  }

  if (payment.created_at) {
    result.created_at = new Date(payment.created_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (payment.updated_at) {
    result.updated_at = new Date(payment.updated_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  // Uncomment and modify the following if translations are needed:
  // if (payment.translations) {
  //   result.translations = translationCollection(payment.translations);
  //   result.locales = payment.translations.map(t => t.locale);
  // }
  // if (payment.translation) {
  //   result.translation = translationResource(payment.translation);
  // }

  return result;
}

module.exports = { paymentResource };
