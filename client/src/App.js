import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import Axios from './Components/User/UserRegistration'
import AdminLogin from './Components/Admin/AdminLogin';
import UserLogin from './Components/User/UserLogin';
import UserRegistration from './Components/User/UserRegistration';
import UserDashboard from './Components/User/UserDashboard';
import UserResetpassword from './Components/User/UserResetpassword';
import UserForgetpassword from './Components/User/UserForgetpassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './Components/Admin/AdminDashboard';

import Homepage from './Components/User/Homepage';

import AdminBooks from './Components/Admin/AdminBooks';
import AdminOrders from './Components/Admin/AdminOrders';
import AdminReviews from './Components/Admin/AdminReviews';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminSettings from './Components/Admin/AdminSettings';



function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<UserLogin />} />
          <Route path='/user_reg' element={<UserRegistration />} />
          <Route path='/user/dashboard' element={<UserDashboard />} />
          <Route path='/user/restpassword' element={<UserResetpassword />} />
          <Route path='/user/forgetpassword' element={<UserForgetpassword />} />
          <Route path='/user/homepage' element={<Homepage />} />
        </Routes>
        <Routes>
          <Route path='admin' element={<AdminLogin />} />
          <Route path='admin/dashboard' element={<AdminDashboard />} />
          <Route path='admin/orders' element={<AdminOrders />} />
          <Route path='admin/books' element={<AdminBooks />} />
          <Route path='admin/users' element={<AdminUsers />} />
          <Route path='admin/reviews' element={<AdminReviews />} />
          <Route path='admin/settings' element={<AdminSettings />} />

        </Routes>











      </BrowserRouter>
    </div>
  );
}

export default App;
