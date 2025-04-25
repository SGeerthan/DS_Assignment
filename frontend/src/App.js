import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Common
import Home from './pages/Home.jsx';

//Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import IndexProfile from './pages/auth/IndexProfile.jsx';
import Profile from './pages/auth/Profile.jsx';
import AuthSuccess from './pages/auth/AuthSuccess.jsx';
import EditProfile from './pages/auth/EditProfile.jsx';
import ForgetPassword from './pages/auth/ForgetPassword.jsx';
import FasterEats from './pages/FasterEats.jsx';
 import Delivery from './pages/Delivery.jsx';
import Restaurant from './pages/Restaurant.jsx'; 

const App = () => {
  return (
    <Router>
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}

      {/** Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profileIndex" element={<IndexProfile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/" element={<FasterEats />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/restaurant" element={<Restaurant />} />

      {/** 404 */}
      
    </Routes>
    </Router>
  );
}

export default App
