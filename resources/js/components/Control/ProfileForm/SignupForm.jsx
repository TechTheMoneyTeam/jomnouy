import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: null
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            phone: ''
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.first_name) newErrors.first_name = 'First name is required.';
        if (!formData.last_name) newErrors.last_name = 'Last name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            setMessage('Please check all required fields.');
            return;
        }

        try {
            const { confirmPassword, ...submitData } = formData;
            const response = await axios.post('/api/signup', submitData);
            setMessage('Account created successfully!');
            
            // Store the user ID in localStorage or state management
            localStorage.setItem('tempUserId', response.data.user.username);

            // Redirect to user type selection
            navigate('/user');

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage(errorMessage);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="title">
                JOM-<span className="highlight">NOUY</span>
            </h1>
            <div className="card-container">
                <div className="card">
                    <div className="text-left">Join us at JOMNOUY</div>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="custom-input"
                                placeholder="Enter Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            {errors.username && <p className="text-red-600">{errors.username}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="custom-input"
                                placeholder="Enter First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.first_name && <p className="text-red-600">{errors.first_name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="custom-input"
                                placeholder="Enter Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.last_name && <p className="text-red-600">{errors.last_name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="custom-input"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <p className="text-red-600">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="custom-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <p className="text-red-600">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="custom-input"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="submit-btn">Sign Up</button>
                    </form>
                    {message && (
                        <div className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            Already have an account? 
                            <Link to="/login" className="text-orange-500 ml-1 hover:text-orange-600">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;