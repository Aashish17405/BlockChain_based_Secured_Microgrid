import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import ContactUs from './ContactUs';
import Home from './Home';
import Navbar from './Navbar'
import Organization from './Toplvl';
import Login from './Login';
import About from './About';
import Middleman from './Middleman';
import Consumer from './Consumer';
import PrivateRoutes from './PrivateRoute';
import { AuthProvider } from './Authcontext';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './Register';
import ProgressBar from './ProgressBar';
import Error from './Error';
function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const checkRole = (requiredRole) => {
  const role = localStorage.getItem('role');
  return role === requiredRole;
};

return (
  <AuthProvider>
    <div className="App">
      <Router>
        <ProgressBar/>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/ContactUs' element={<ContactUs />} />
            <Route path='/About' element={<About />} />
            <Route element={<Login setIsLoggedIn={setIsLoggedIn} />} path="/login" exact />
            <Route element={<PrivateRoutes />}>
              <Route element={checkRole('Power_System_Operators') ? <Organization /> : <Navigate to="/login" />} path="/Power_System_Operators" exact />
              <Route element={checkRole('Data_Analysts') ? <Middleman/> : <Navigate to="/login" />} path='/Data_Analysts' exact/>
              <Route element={checkRole('consumers') ? <Consumer/> : <Navigate to="/login" />} path='/consumers' exact/>
              <Route element={checkRole('Power_System_Operators') ? <Register/> : <Navigate to="/login" />} path='/register' exact/>
            </Route>

            <Route path='*' element={<Error/>}></Route>
          </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </div>
  </AuthProvider>
 );
}

export default App;
