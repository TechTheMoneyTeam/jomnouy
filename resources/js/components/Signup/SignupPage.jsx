import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import axios from 'axios';
import './SignupPage.css';

const SignUpCard = () => {
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
                                                                           <div className="text-left-signup">Sign up</div>
                                                                           <form onSubmit={handleSubmit} className="form">

                                                                                          <div className="form-group">
                                                                                                         <label htmlFor="username">Username</label>
                                                                                                         <input
                                                                                                                        type="text"
                                                                                                                        id="username"
                                                                                                                        name="username"
                                                                                                                        className="custom-input"
                                                                                                                        placeholder="Enter username"
                                                                                                                        value={formData.username}
                                                                                                                        onChange={handleChange}
                                                                                                                        required
                                                                                                         />
                                                                                          </div>
                                                                                          <div className="form-row">
                                                                                                         <div className="form-group">
                                                                                                                        <label htmlFor="first_name">First Name</label>
                                                                                                                        <input
                                                                                                                                       type="text"
                                                                                                                                       id="first_name"
                                                                                                                                       name="first_name"
                                                                                                                                       className="custom-input"
                                                                                                                                       placeholder="First Name"
                                                                                                                                       value={formData.first_name}
                                                                                                                                       onChange={handleChange}
                                                                                                                        />
                                                                                                         </div>
                                                                                                         <div className="form-group">
                                                                                                                        <label htmlFor="last_name">Last Name</label>
                                                                                                                        <input
                                                                                                                                       type="text"
                                                                                                                                       id="last_name"
                                                                                                                                       name="last_name"
                                                                                                                                       className="custom-input"
                                                                                                                                       placeholder="Last Name"
                                                                                                                                       value={formData.last_name}
                                                                                                                                       onChange={handleChange}
                                                                                                                        />
                                                                                                         </div>
                                                                                          </div>

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
                                                                                                                        placeholder="Enter password"
                                                                                                                        value={formData.password}
                                                                                                                        onChange={handleChange}
                                                                                                                        required
                                                                                                         />
                                                                                          </div>
                                                                                          <div className="form-group">
                                                                                                         <label htmlFor="confirmPassword">Confirm Password</label>
                                                                                                         <input
                                                                                                                        type="password"
                                                                                                                        id="confirmPassword"
                                                                                                                        name="confirmPassword"
                                                                                                                        className="custom-input"
                                                                                                                        placeholder="Confirm password"
                                                                                                                        value={formData.confirmPassword}
                                                                                                                        onChange={handleChange}
                                                                                                                        required
                                                                                                         />
                                                                                          </div>
                                                                                          <Link to="/login" className="text-end underline">Already have an account?</Link>
                                                                                          <button type="submit" className="submit-btn">Create Account</button>
                                                                                          <a href="#" className="text-center">
                                                                                                         <FaFacebook size="20" /><span> Continue with Facebook</span>
                                                                                          </a>
                                                                           </form>
                                                            </div>
                                             </div>
                              </div>
               );
};

export default SignUpCard;
