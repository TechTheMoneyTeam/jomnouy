import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            setMessage('Login successful!');
            console.log(response.data);
            
            // Save user data to localStorage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            // Clear the form
            resetForm();
            
            // Show success message briefly before redirecting
            setTimeout(() => {
                navigate('/projectlist'); // Redirect to home page
            }, 500); // Wait 0.5 second before redirecting

        } catch (error) {
            setMessage('Incorrect credentials');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="title">
                JOM-<span className="highlight">NOUY</span>
            </h1>
            <div className="card-container-login">
                <div className="card-login">
                    <div className="text-left">Welcome back to JOMNOUY</div>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
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
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
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
                        </div>
                        <a href="#" className="text-end underline">Forgot password?</a>
                        <button type="submit" className="submit-btn">Login</button>
                    </form>
                    {message && (
                        <div className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;