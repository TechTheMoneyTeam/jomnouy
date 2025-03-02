import React, { useState } from 'react';
import { FaFacebook } from "react-icons/fa";
import './loginPage.css';
import { Link } from 'react-router-dom';

const Loginpage = () => {
               const [formData, setFormData] = useState({
                              email: '',
                              password: '',
               });

               const handleChange = (e) => {
                              setFormData({
                                             ...formData,
                                             [e.target.name]: e.target.value
                              });
               };

               const handleSubmit = async (e) => {
                              e.preventDefault();

                              // Example of sending the login request to the backend
                              const response = await fetch('/api/login', {
                                             method: 'POST',
                                             headers: {
                                                            'Content-Type': 'application/json',
                                             },
                                             body: JSON.stringify({
                                                            email: formData.email,
                                                            password: formData.password,
                                             }),
                              });

                              if (response.ok) {
                                             const data = await response.json();
                                             console.log('Login successful:', data);
                                             // Handle successful login (e.g., redirect to dashboard)
                              } else {
                                             console.error('Login failed');
                                             // Handle failed login (e.g., show error message)
                              }
               };

               return (
                              <div className="flex flex-col items-center justify-center min-h-screen">
                                             <h1 className="title">
                                                            JOM-<span className="highlight">NOUY</span>
                                             </h1>
                                             <div className="card-container">
                                                            <div className="card">
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
                                                                                                                        value={formData.email} // bind value
                                                                                                                        onChange={handleChange} // handle change
                                                                                                                        className="custom-input"
                                                                                                                        placeholder="sal@gmail.com"
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
                                                                                                                        value={formData.password} // bind value
                                                                                                                        onChange={handleChange} // handle change
                                                                                                                        className="custom-input"
                                                                                                                        placeholder="Enter your password"
                                                                                                                        required
                                                                                                         />
                                                                                          </div>
                                                                                          <a href="#" className="text-end underline text-xs">Forgot password?</a>
                                                                                          <button type="submit" className="submit-btn">Login</button>
                                                                                                         <div className="text-center mt-2 text-gray-500 text-xs">
                                                                                                                        <span>Don't have an account? </span>
                                                                                                                        <Link to="/signup" className="text-blue-600">
                                                                                                                                       Create account
                                                                                                                        </Link>
                                                                                                         </div>

                                                                           </form>
                                                            </div>
                                             </div>
                              </div>
               );
};

export default Loginpage;
