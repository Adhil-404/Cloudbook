// Updated OrderManager utility
const OrderManager = {
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

  updateOrderStatus: (orderId, newStatus) => {
    try {
      const globalOrders = JSON.parse(localStorage.getItem('globalOrders') || '[]');
      const globalUpdated = globalOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('globalOrders', JSON.stringify(globalUpdated));

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

const handlePaymentSuccess = async () => {
  try {
    const { orderId, orderData, paymentMethod } = location.state;
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const orderExists = existingOrders.find(order => order._id === orderId);
    
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = userInfo.userName || userInfo.name || userInfo.username || 'Guest User';
    const userEmail = userInfo.userEmail || userInfo.email || 'guest@example.com';
    
    if (!orderExists) {
      const newOrder = {
        _id: orderId,
        orderNumber: orderId,
        orderDate: new Date().toISOString(),
        status: 'confirmed',
        items: orderData.items.map(item => ({
          ...item,
          coverImage: item.coverImage || 'default-book.jpg'
        })),
        totalAmount: orderData.totalAmount,
        itemCount: orderData.items.length,
        paymentMethod: paymentMethod,
        customerName: userName,
        customerEmail: userEmail,
        userId: userInfo._id || null
      };

      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      // Save to global orders for admin visibility
      OrderManager.saveOrderGlobally(newOrder);
      OrderManager.saveOrderForUser(newOrder);
      
      // Try to save to backend as well
      try {
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('userToken') || 
                     sessionStorage.getItem('token');
        
        if (token) {
          await axios.post('http://localhost:5000/api/orders', newOrder, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Order saved to backend successfully');
        }
      } catch (backendError) {
        console.log('Backend not available, order saved locally only');
      }
      
      setOrders(updatedOrders);
    } else {
      setOrders(existingOrders);
    }
    
    setLoading(false);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
    fetchOrders(); 
  }
};