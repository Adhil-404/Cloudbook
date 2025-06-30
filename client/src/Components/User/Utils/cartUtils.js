// utils/cartUtils.js

export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (id) => {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};

// Add this function to your existing cartUtils.js file

export const updateCartQuantity = (id, newQuantity) => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart[itemIndex].quantity = newQuantity;
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return false;
  }
};

