// Homescreen.js
import React, { useState } from 'react';
import { FaFacebook } from "react-icons/fa";
import Navbar from '../Navbar/Navbar';
import './Homescreen.css';

const Homescreen = () => {
               return (
                              <div>
                                             {/* Include Navbar component here */}
                                             <Navbar />

                                             {/* Your homescreen content */}
                                             <div className="content">
                                                            <h1>Welcome to the Home Screen!</h1>
                                                            <p>Some content here...</p>
                                             </div>
                              </div>
               );
};

export default Homescreen;
