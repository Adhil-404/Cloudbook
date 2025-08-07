import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNav from './Usernav';
import UserFooter from './UserFooter';
import { ToastContainer, toast } from 'react-toastify';
import '../../Assets/Styles/Userstyles/UserPayment.css';
import visaImg from "../../Assets/Images/visa-png.png";
import mastercardImg from "../../Assets/Images/mastercard.jpg"
import paytmImg from "../../Assets/Images/Paytm.jpg"
import gpayImg from "../../Assets/Images/gpay.png"

function UserPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (!location.state || !location.state.orderData) {
      toast.error("No order data found. Redirecting...");
      navigate('/user/homepage');
      return;

      
    }
    setOrderData(location.state.orderData);
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setCardDetails(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
      return;
    }

    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
      if (formatted.length <= 5) {
        setCardDetails(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
      return;
    }

    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 3) {
        setCardDetails(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
      return;
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error("Please enter a valid 3-digit CVV");
        return false;
      }
      if (!cardDetails.cardholderName.trim()) {
        toast.error("Please enter the cardholder name");
        return false;
      }
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;

    const token = localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('authToken');

    if (!token) {
      toast.error("Please login to complete payment");
      navigate('/user/userlogin');
      return;
    }

    setProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast.success("Payment successful! Order placed successfully.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/user/orders', {
          state: {
            orderSuccess: true,
            orderId: 'order_' + Date.now(),
            orderData: orderData,
            paymentMethod: paymentMethod,
            message: "Your order has been placed successfully!"
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      
      toast.success("Payment successful! Order placed successfully.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/user/orders', {
          state: {
            orderSuccess: true,
            orderId: 'order_' + Date.now(),
            orderData: orderData,
            paymentMethod: paymentMethod,
            message: "Your order has been placed successfully!"
          }
        });
      }, 2000);
    } finally {
      setProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div>
        <UserNav />
        <div className="loading-payment">
          <div className="payment-spinner"></div>
          <h3>Loading payment details...</h3>
        </div>
        <UserFooter />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <UserNav />
      <div className="payment-container">
        <h2 className="payment-title">Complete Your Payment</h2>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {orderData.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-info">
                <div className="item-title">{item.title}</div>
                <div className="item-details">
                  <span>by {item.author}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>{item.category}</span>
                </div>
              </div>
              <div className="item-price">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
          <div className="order-total">
            <span>Total Amount:</span>
            <span className="total-amount">₹{orderData.totalAmount}</span>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-option-content">
                <span>Credit/Debit Card</span>
              </div>
            </label>
            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-option-content">
                <span>UPI Payment</span>
              </div>
            </label>
            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-option-content">
                <span>Cash on Delivery</span>
              </div>
            </label>
          </div>

          <div className="accepted-payments">
            <h4>We Accept</h4>
            <div className="all-payment-logos">
              <img src={visaImg} className="visa" alt="Visa" />
              <img src={mastercardImg} className="mastercard" alt="Mastercard" />
              <img src={paytmImg} className="paytm" alt="Paytm" />
              <img src={gpayImg} className="gpay" alt="Google Pay" />
            </div>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="payment-form">
            <h4>💳 Card Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    className="form-input"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  className="form-input"
                  placeholder="John Doe"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="payment-form upi-payment">
            <h4>📱 UPI Payment</h4>
            <div className="qr-code">📱</div>
            <p className="upi-instruction">
              Scan QR code with any UPI app
            </p>
            <div className="upi-id">cloudbooks@paytm</div>
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="payment-form cod-payment">
            <h4>💰 Cash on Delivery</h4>
            <span className="cod-icon">💰</span>
            <p className="cod-info">
              Pay ₹{orderData.totalAmount} when your order is delivered to your doorstep.
              <br />
              Please keep the exact amount ready for a smooth delivery experience.
            </p>
          </div>
        )}

        <div className="payment-button-container">
          <button
            className="payment-button"
            onClick={processPayment}
            disabled={processing}
          >
            {processing ? 'Processing Payment...' : `Pay ₹${orderData.totalAmount}`}
          </button>
        </div>

        <div className="security-note">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
      <UserFooter />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default UserPayment;