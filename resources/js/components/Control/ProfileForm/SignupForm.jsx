import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',  // Added back as required by backend
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact_info: '',  // Added back as required by backend
        phone: '',        // Added back as required by backend
        bio: ''          // Added back as required by backend
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            // Create submission data without confirmPassword
            const submissionData = {
                ...formData,
                // Don't send confirmPassword to backend
                confirmPassword: undefined
            };

            const response = await axios.post('/api/signup', submissionData);
            setMessage('Signup successful!');
            setErrors({});
        } catch (error) {
            console.error('Signup error:', error.response?.data);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            setMessage(error.response?.data?.message || 'Signup failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username field - required by backend */}
                <div>
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Re-Enter Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Hidden fields that might be required by backend */}
                <input type="hidden" name="contact_info" value={formData.contact_info} />
                <input type="hidden" name="bio" value={formData.bio} />

                <button 
                    type="submit" 
                    className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Create Account
                </button>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">Already have account? 
                        <a href="/login" className="text-orange-500 ml-1 hover:text-orange-600">
                            Login
                        </a>
                    </p>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                <button 
                    type="button"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.016 4.432 10.984 10.206 11.852V15.18H7.237v-3.154h2.969V9.927c0-3.475 1.693-5 4.581-5 1.383 0 2.115.103 2.461.149v2.753h-1.97c-1.226 0-1.654 1.163-1.654 2.473v1.724h3.593l-.487 3.154h-3.106v8.697C19.481 23.083 24 18.075 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    CONTINUE WITH FACEBOOK
                </button>
            </form>

            {message && (
                <p className={`mt-4 text-center ${
                    message.includes('successful') ? 'text-green-600' : 'text-red-600'
                }`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default SignupForm;