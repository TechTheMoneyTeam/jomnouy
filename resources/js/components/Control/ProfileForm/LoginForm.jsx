import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';
import forgotStyles from './Forgotpassword.module.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            setMessage('Login successful!');
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            setTimeout(() => {
                navigate('/projectlist1');
            }, 500);
        } catch (error) {
            setMessage('Incorrect credentials');
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');
        setIsLoading(true);

        if (!forgotEmail) {
            setForgotError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/forgot-password', { 
                email: forgotEmail
            });
            
            // Save the email to localStorage when reset instructions are sent
            localStorage.setItem('forgotPasswordEmail', forgotEmail);
            
            setForgotSuccess('Reset instructions have been sent to your email');
            
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to send reset instructions');
        } finally {
            setIsLoading(false);
        }
    };

    const openForgotPassword = (e) => {
        e.preventDefault();
        setShowForgotPassword(true);
        
        // Pre-fill the forgot password email field with the value from localStorage if available
        const savedEmail = localStorage.getItem('forgotPasswordEmail');
        if (savedEmail) {
            setForgotEmail(savedEmail);
        }
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotError('');
        setForgotSuccess('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="title">JOM-<span className="highlight">NOUY</span></h1>
            <div className="card-container-login">
                <div className="card-login">
                    <div className="text-left">Welcome back to JOMNOUY</div>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
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
                            <label htmlFor="password">Password</label>
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
                        <a href="#" onClick={openForgotPassword} className="text-end underline">Forgot password?</a>
                        <button type="submit" className="submit-btn10">Login</button>
                        <div className="text-center mt-2 text-gray-500 text-xs">
                            <span>Don't have an account? </span>
                            <Link to="/signup" className="text-blue-600">Create account</Link>
                        </div>
                    </form>
                    {message && (
                        <div className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Forgot Password Popup */}
            {showForgotPassword && (
                <div className={`${forgotStyles.backdropBlur} fixed inset-0 flex items-center justify-center z-50`}>
                    <div className={`${forgotStyles.bgBlack} absolute inset-0 opacity-30`}></div>
                    <div className={`${forgotStyles.formContainer} bg-white relative z-10`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={forgotStyles.title}>Forgot your password?</h2>
                            <button onClick={closeForgotPassword} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className={forgotStyles.description}>
                            Enter your email address below and we'll send you reset instructions.
                        </p>
                        {forgotError && (
                            <div className={forgotStyles.errorAlert}>
                                <p className={forgotStyles.errorText}>{forgotError}</p>
                            </div>
                        )}
                        {forgotSuccess && (
                            <div className={forgotStyles.successAlert}>
                                <p className={forgotStyles.successText}>{forgotSuccess}</p>
                            </div>
                        )}
                        <form onSubmit={handleForgotSubmit} className={forgotStyles.form}>
                            <div className={forgotStyles.formGroup}>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className={forgotStyles.input}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className={forgotStyles.resetButton} disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;