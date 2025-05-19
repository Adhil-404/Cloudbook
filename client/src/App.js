import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminLogin from './Components/Admin/AdminLogin';
import UserLogin from './Components/User/UserLogin';
import UserRegistration from './Components/User/UserRegistration';
import UserDashboard from './Components/User/UserDashboard';
import UserResetpassword from './Components/User/UserResetpassword';
import UserForgetpassword from './Components/User/UserForgetpassword';
import { BrowserRouter ,Routes, Route} from 'react-router-dom';
import AdminDashboard from './Components/Admin/AdminDashboard';

import Homepage from './Components/User/Homepage';

import AdminBooks from './Components/Admin/AdminBooks';



function App() {
  return (
    <div className="App">
{/* <Homepage/> */}
<BrowserRouter>

<Routes>
  <Route path='/' element={<UserLogin />} />
  <Route path='/user_reg' element={<UserRegistration />} />
  <Route path='/user/dashboard' element={<UserDashboard/>}/>
  <Route path='/user/restpassword' element={<UserResetpassword/>}/>
  <Route path='/user/forgetpassword' element={<UserForgetpassword />}/>
  <Route path='/user/homepage' element={<Homepage/>}/>
</Routes>
<Routes>
  <Route path='admin' element={ <AdminLogin/> }/>
  <Route path='admin/dashboard' element={<AdminDashboard/>}/>
  <Route path='admin/books' element={<AdminBooks/>}/>

</Routes>


      
      

      


     
      

      </BrowserRouter>
    </div>
  );
}

export default App;
