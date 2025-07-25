// resources/userPointResource.js

function userPointResource(userPointInstance) {
  if (!userPointInstance) return null;

  return {
    user_id: userPointInstance.user_id,
    price: parseFloat(userPointInstance.price),
  };
}

module.exports = userPointResource;
