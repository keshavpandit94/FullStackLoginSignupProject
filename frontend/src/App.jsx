import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup'; // Import your SignUp component
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import PasswordChange from './components/PasswordChange';

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<PasswordChange />} />
      </Routes>
    </Router>
  )
}

export default App;