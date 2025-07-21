// resources/UserCartResource.js

const CartDetailResource = require('./CartDetailResource');

class UserCartResource {
  static toJSON(userCart) {
    if (!userCart) return null;

    return {
      id: userCart.id,
      cart_id: userCart.cart_id,
      user_id: userCart.user_id,
      status: !!userCart.status,
      name: userCart.name,
      uuid: userCart.uuid,
      cartDetails: userCart.cartDetails
        ? userCart.cartDetails.map(detail => CartDetailResource.toJSON(detail))
        : [],
    };
  }
}

module.exports = UserCartResource;
