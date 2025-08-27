import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import BACK_URL from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Form validation
    const validateForm = () => {
        setError(''); // Clear previous errors

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        if (!password.trim()) {
            setError('Password is required');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleLogin = (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate form before making API call
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(''); // Clear any previous errors

        axios.post(`${BACK_URL}/api/v1/user/login`, {
            email: email.trim(),
            password
        },
        // { withCredentials: true }
    )
            .then((res) => {
                console.log("Login Successful:", res.data.data);

                console.log(res.data.token)
                const token = res.data.data.token || res.data.token; // Adjust based on your API response structure
                console.log(token)
                if (token) {
                    localStorage.setItem('authToken', token);

                    // Set axios default header for future requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Store user data if needed
                const user = res.data.data.user || res.data.user;
                if (user) {
                    localStorage.setItem('userData', JSON.stringify(user));
                }

                setShowMessage(true); // Show success message

                // Redirect after delay
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            })
            .catch((error) => {
                console.error("Login Error:", error.response?.data?.message || error.message);

                let errorMessage = error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    'Login failed. Please try again.';

                // Handle specific error cases
                const status = error.response?.status;
                const originalMessage = errorMessage.toLowerCase();

                if (status === 401 ||
                    originalMessage.includes('invalid') ||
                    originalMessage.includes('incorrect') ||
                    originalMessage.includes('wrong') ||
                    originalMessage.includes('unauthorized') ||
                    originalMessage.includes('authentication failed') ||
                    originalMessage.includes('login failed')) {
                    errorMessage = 'Incorrect password. Please try again.';
                } else if (status === 404 || originalMessage.includes('user not found')) {
                    errorMessage = 'No account found with this email address.';
                } else if (status === 429) {
                    errorMessage = 'Too many login attempts. Please try again later.';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }

                setError(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Clear error when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Log In</h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${error && !email.trim()
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                            onChange={handleEmailChange}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${error && !password.trim()
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                            onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 mr-2 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeDasharray="32"
                                        strokeDashoffset="32"
                                    >
                                        <animate
                                            attributeName="stroke-dasharray"
                                            dur="2s"
                                            values="0 32;16 16;0 32;0 32"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-dashoffset"
                                            dur="2s"
                                            values="0;-16;-32;-32"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {/* Success Message */}
                {showMessage && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md text-center">
                        <span className="flex items-center justify-center">
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Login successful! Redirecting...
                        </span>
                    </div>
                )}

                {/* Sign Up Link */}
                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <NavLink
                        to="/signup"
                        className="text-blue-500 hover:underline focus:outline-none focus:underline"
                    >
                        Sign Up
                    </NavLink>
                </p>

                {/* Forgot Password Link */}
                <p className="text-sm text-center text-gray-600">
                    <NavLink
                        to="/forgot-password"
                        className="text-blue-500 hover:underline focus:outline-none focus:underline"
                    >
                        Forgot your password?
                    </NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login;