const smsGatewayResource = (smsGatewayInstance) => {
  if (!smsGatewayInstance) return null;

  // Return all fields as-is (like Laravel's parent::toArray)
  return smsGatewayInstance.get?.() || { ...smsGatewayInstance };
};

module.exports = smsGatewayResource;
