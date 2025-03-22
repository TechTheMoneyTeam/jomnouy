import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get email from localStorage
        const storedEmail = localStorage.getItem('forgotPasswordEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        // Validate password length
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Submitting password reset');
            
            // Send the email with the request
            const response = await axios.post('/api/settings/change-password1', {
                email: email,  // Include the email from state
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            });
            
            setIsSuccess(true);
            setMessage('Password reset successful! You will be redirected to login page.');
            
            // Clear the stored data after successful reset
            localStorage.removeItem('forgotPasswordEmail');
            
            // Redirect to login page after successful reset
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            let errorMsg = 'Failed to reset password. Please try again.';
            
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            }
            
            console.error('Password reset error:', error);
            setIsSuccess(false);
            setMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="title">JOM-<span className="highlight">NOUY</span></h1>
            <div className="card-container-login">
                <div className="card-login">
                    <div className="text-left mb-4">Reset Your Password</div>
                    {email && (
                        <div className="text-sm text-gray-600 mb-4">
                            Reset password for: <span className="font-bold">{email}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className="custom-input"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group mt-4">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="custom-input"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>
                        
                        {/* Password requirements */}
                        <div className="mt-2 text-sm text-gray-600">
                            Password must have at least 6 characters
                        </div>
                        
                        {/* Display any message */}
                        {message && (
                            <div className={`mt-4 text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="submit-btn mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;