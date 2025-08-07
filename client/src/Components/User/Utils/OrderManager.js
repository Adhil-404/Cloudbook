// Add this utility file: src/utils/OrderManager.js

export const OrderManager = {
  // Save order to global storage (visible to admin)
  saveOrderGlobally: (order) => {
    try {
      const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
      const existingIndex = globalOrders.findIndex(o => o._id === order._id);
      
      if (existingIndex >= 0) {
        globalOrders[existingIndex] = order;
      } else {
        globalOrders.unshift(order);
      }
      
      localStorage.setItem('globalOrders', JSON.stringify(globalOrders));
    } catch (error) {
      console.error('Error saving order globally:', error);
    }
  },

  // Save order for current user
  saveOrderForUser: (order) => {
    try {
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const existingIndex = userOrders.findIndex(o => o._id === order._id);
      
      if (existingIndex >= 0) {
        userOrders[existingIndex] = order;
      } else {
        userOrders.unshift(order);
      }
      
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
    } catch (error) {
      console.error('Error saving user order:', error);
    }
  },

  // Get all orders (for admin)
  getAllOrders: () => {
    try {
      return JSON.parse(localStorage.getItem('globalOrders') || '[]');
    } catch (error) {
      console.error('Error getting global orders:', error);
      return [];
    }
  },

  // Get orders for current user
  getUserOrders: () => {
    try {
      return JSON.parse(localStorage.getItem('userOrders') || '[]');
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  },

  // Update order status globally
  updateOrderStatus: (orderId, newStatus) => {
    try {
      // Update in global orders
      const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
      const globalUpdated = globalOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('globalOrders', JSON.stringify(globalUpdated));

      // Update in user orders if it exists
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const userUpdated = userOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('userOrders', JSON.stringify(userUpdated));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }
};