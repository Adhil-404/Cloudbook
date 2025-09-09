import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 🟢 User Components
import UserLogin from './Components/User/UserLogin';
import UserRegistration from './Components/User/UserRegistration';
import UserResetpassword from './Components/User/UserResetpassword';
import UserForgetpassword from './Components/User/UserForgetpassword';
import UserBooks from './Components/User/UserBooks';
import UserOrders from './Components/User/UserOrders';
import UserSettings from './Components/User/UserSettings';
import Homepage from './Components/User/Homepage';
import HomepageProduct from './Components/User/HomepageProduct';
import ProductDetail from './Components/User/ProductDetail';
import ContactForm from './Components/User/ContactForm';
import Cart from './Components/User/Cart';
import Wishlist from './Components/User/Wishlist';
import AboutUs from './Components/User/AboutUs';
import UserProfile from './Components/User/UserProfile';
import UserReview from './Components/User/UserReview';
import UserHelp from './Components/User/UserHelp';
import UserNotification from './Components/User/UserNotification';
import UserPayment from './Components/User/UserPayment';
import Subscribe from './Components/User/Subscribe';

// 🔴 Admin Components
import AdminLogin from './Components/Admin/AdminLogin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminOrders from './Components/Admin/AdminOrders';
import AdminBooks from './Components/Admin/AdminBooks';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminReviews from './Components/Admin/AdminReviews';
import AdminSettings from './Components/Admin/AdminSettings';
import AdminAddbook from './Components/Admin/AdminAddbook';
import AdminEditBook from './Components/Admin/AdminEditBook';




console.log("UserRegistration:", UserRegistration);



function App() {
  console.log("🔍 App.js is running...");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* 🟢 User Routes */}
          <Route path='/' element={<UserLogin />} />
          <Route path='/user_reg' element={<UserRegistration />} />
          <Route path='/user/resetpassword' element={<UserResetpassword />} />
          <Route path='/user/forgetpassword' element={<UserForgetpassword />} />
          <Route path='/user/books' element={<UserBooks />} />
          <Route path='/user/orders' element={<UserOrders />} />
          <Route path='/user/settings' element={<UserSettings />} />
          <Route path='/user/homepage' element={<Homepage />} />
          <Route path='/user/homepage/product' element={<HomepageProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path='/user/homepage/contact' element={<ContactForm />} />
          <Route path='/user/homepage/cart' element={<Cart />} />
          <Route path='/user/homepage/wishlist' element={<Wishlist />} />
          <Route path='/user/homepage/aboutus' element={<AboutUs />} />
          <Route path='/user/homepage/order' element={<UserOrders />} />
          <Route path='/user/homepage/profile' element={<UserProfile />} />
          <Route path='/user/homepage/reviews' element={<UserReview />} />
          <Route path='/user/homepage/support' element={<UserHelp />} />
          <Route path='/user/homepage/notifications' element={<UserNotification />} />
          <Route path='/user/payment' element={<UserPayment />} />
          <Route path='/user/subscribe' element={<Subscribe />} />

          {/* 🔴 Admin Routes */}
          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/orders' element={<AdminOrders />} />
          <Route path='/admin/books' element={<AdminBooks />} />
          <Route path='/admin/users' element={<AdminUsers />} />
          <Route path='/admin/reviews' element={<AdminReviews />} />
          <Route path='/admin/settings' element={<AdminSettings />} />
          <Route path='/admin/addbook' element={<AdminAddbook />} />
          <Route path="/admin/editbook/:id" element={<AdminEditBook />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
