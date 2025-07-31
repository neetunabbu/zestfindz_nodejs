// src/app/Observers/CartDetailProductObserver.js

const { CartDetailProduct } = require('../../models/CartDetailProduct'); // adjust path if needed

// Function to handle the "deleting" event
const deleting = async (cartDetailProduct) => {
  try {
    if (cartDetailProduct && typeof cartDetailProduct.getGalleries === 'function') {
      const galleries = await cartDetailProduct.getGalleries();
      if (galleries && typeof galleries.destroy === 'function') {
        await galleries.destroy();
      }
    }
  } catch (error) {
    console.error('Error deleting galleries related to CartDetailProduct:', error);
  }
};

module.exports = {
  deleting,
};
