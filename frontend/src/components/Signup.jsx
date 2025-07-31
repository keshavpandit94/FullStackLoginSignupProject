import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const navigate = useNavigate();

    // Comprehensive form validation
    const validateForm = () => {
        const errors = {};
        setError('');
        setFieldErrors({});

        // Full Name validation
        if (!fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (fullName.trim().length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
            errors.fullName = 'Full name can only contain letters and spaces';
        }

        // Username validation
        if (!username.trim()) {
            errors.username = 'Username is required';
        } else if (username.trim().length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (username.trim().length > 20) {
            errors.username = 'Username must not exceed 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            errors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // Email validation
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            errors.email = 'Please enter a valid email address';
        }

        // Mobile number validation
        if (!mobileNumber.trim()) {
            errors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(mobileNumber.trim().replace(/\D/g, ''))) {
            errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm password validation
        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return false;
        }

        return true;
    };

    const handleSignup = (e) => {
        e.preventDefault();

        // Validate form before making API call
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        // Clean mobile number (remove any non-digit characters)
        const cleanMobileNumber = mobileNumber.replace(/\D/g, '');

        axios.post('/api/v1/user/signup', {
            email: email.trim().toLowerCase(),
            username: username.trim().toLowerCase(),
            fullName: fullName.trim(),
            mobileNumber: cleanMobileNumber,
            password,
        })
            .then((res) => {
                console.log("Signup Successful:", res.data.data);

                // Store authentication token if provided
                const token = res.data.data.token || res.data.token;
                if (token) {
                    localStorage.setItem('authToken', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Store user data if needed
                const user = res.data.data.user || res.data.user;
                if (user) {
                    localStorage.setItem('userData', JSON.stringify(user));
                }

                setShowMessage(true);

                // Redirect after delay
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            })
            .catch((error) => {
                console.error("Signup Error:", error.response?.data?.message || error.message);

                let errorMessage = error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    'Signup failed. Please try again.';

                const status = error.response?.status;
                const originalMessage = errorMessage.toLowerCase();

                // Handle specific error cases
                if (status === 409) {
                    if (originalMessage.includes('email')) {
                        errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
                    } else if (originalMessage.includes('username')) {
                        errorMessage = 'This username is already taken. Please choose a different username.';
                    } else if (originalMessage.includes('mobile') || originalMessage.includes('phone')) {
                        errorMessage = 'An account with this mobile number already exists.';
                    } else {
                        errorMessage = 'Account already exists with the provided information.';
                    }
                } else if (status === 400) {
                    errorMessage = 'Invalid information provided. Please check your details and try again.';
                } else if (status === 429) {
                    errorMessage = 'Too many signup attempts. Please try again later.';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }

                setError(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle input changes with real-time validation clearing
    const handleInputChange = (field, value) => {
        // Clear field-specific error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        if (error) setError('');

        // Set the value
        switch (field) {
            case 'fullName':
                setFullName(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'mobileNumber':
                // Allow only numbers and common formatting characters
                const cleanValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
                setMobileNumber(cleanValue);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-300 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Sign Up</h1>

                <form className="space-y-4" onSubmit={handleSignup}>
                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={fullName}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.fullName
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your full name"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                        {fieldErrors.fullName && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                        )}
                    </div>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.username
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your username"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                        />
                        {fieldErrors.username && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        {fieldErrors.email && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number *
                        </label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={mobileNumber}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.mobileNumber
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your mobile number"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        />
                        {fieldErrors.mobileNumber && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.mobileNumber}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password *
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-9 right-3 text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors.password && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                        )}
                    </div>


                    {/* Confirm Password Field */}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password *
                        </label>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            className={`w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:outline-none ${fieldErrors.confirmPassword
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Confirm your password"
                            required
                            disabled={isLoading}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute top-9 right-3 text-gray-500"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>


                    {/* General Error Message */}
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
                                Creating account...
                            </span>
                        ) : (
                            'Sign Up'
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
                            Account created successfully! Redirecting...
                        </span>
                    </div>
                )}

                {/* Login Link */}
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <NavLink
                        to="/login"
                        className="text-blue-500 hover:underline focus:outline-none focus:underline"
                    >
                        Log In
                    </NavLink>
                </p>
            </div>
        </div>
    );
}

export default Signup;