import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BACK_URL from '../api';

const EditProfile = () => {
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !mobileNumber || !fullName) {
            setError('All fields are required.');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!/^\d{10}$/.test(mobileNumber)) {
            setError('Mobile number must be 10 digits.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const cleanMobileNumber = mobileNumber.replace(/\D/g, '').slice(-10);

        setLoading(true);
        axios
            .post(`${BACK_URL}/api/v1/user/detail-update`, {
                email: email.trim().toLowerCase(),
                mobileNumber: cleanMobileNumber,
                fullName: fullName.trim(),
            })
            .then((res) => {
                console.log('Profile updated successfully:', res.data);
                setSuccess('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                setError('Failed to update profile. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-300 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                {success && <div className="mb-4 text-green-500 text-sm text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number:
                        </label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="Enter your mobile number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                <button
                    onClick={handleChangePassword}
                    className="w-full mt-4 px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                    Change Password
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
