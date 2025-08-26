import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BACK_URL from '../api';

function PasswordChange() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate()

    const validateForm = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (oldPassword === newPassword) {
            setError('Please provide new password!')
            return false
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 6 characters long.');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        axios.post(`${BACK_URL}/api/v1/user/password-change`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
            .then((res) => {
                setMessage('Password changed successfully.');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                navigate('/home');
        }, 1500)
            })
            .catch((err) => {
                const msg = err.response?.data?.message || 'Failed to change password.';
                setError(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-300 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>

                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                {message && <div className="mb-4 text-green-600 text-sm text-center">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div className="relative">
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute top-[38px] right-3 text-gray-500"
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type={showNew ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute top-[38px] right-3 text-gray-500"
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute top-[38px] right-3 text-gray-500"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PasswordChange;
