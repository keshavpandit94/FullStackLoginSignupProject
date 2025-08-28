import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BACK_URL from '../api';

function Home() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  console.log(token)
  useEffect(() => {
    
    axios.get(`${BACK_URL}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      // withCredentials: true,
    })
      .then((res) => {
        setUser(res.data.data);
        console.log("data", res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);


  const handleLogout = () => {
    axios.post(`${BACK_URL}/api/v1/user/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      // withCredentials: true,
    })
      .then(() => {
        setMessage('Logged out successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      })
      .catch((error) => {
        console.error('Logout error:', error.response?.data?.message || error.message);
      });
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteAccount = () => {
    axios.post(`${BACK_URL}/api/v1/user/delete-account`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    })
      .then(() => {
        setMessage('Account deleted successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      })
      .catch((error) => {
        console.error('Delete Account Error:', error.response?.data?.message || error.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">User Information</h1>

        {message && (
          <div className="mb-4 text-green-600 text-sm text-center">{message}</div>
        )}

        <div className="space-y-2">
          {user ? (
            <>
              <p className="text-sm text-gray-700"><span className="font-medium">Full Name:</span> {user.fullName}</p>
              <p className="text-sm text-gray-700"><span className="font-medium">Username:</span> {user.username}</p>
              <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {user.email}</p>
              <p className="text-sm text-gray-700"><span className="font-medium">Mobile Number:</span> {user.mobileNumber}</p>
            </>
          ) : (
            <p className="text-sm text-gray-700">Loading user data...</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 px-4 py-2 text-white bg-red-400 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full mt-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Delete Account
        </button>
        <button
          onClick={handleEditProfile}
          className="w-full mt-4 px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Home;
