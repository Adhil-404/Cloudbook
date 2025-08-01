export const getCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
};

export const addToCart = (product) => {
  try {
    const cart = getCart();

    const productId = product._id || product.id; 
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        id: productId, 
        quantity: 1 
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const removeFromCart = (id) => {
  try {
    const updatedCart = getCart().filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

export const updateCartQuantity = (id, newQuantity) => {
  try {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
      if (newQuantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = newQuantity;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return false;
  }
};
