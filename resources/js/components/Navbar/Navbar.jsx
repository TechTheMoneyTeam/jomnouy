import React from 'react';
import './Navbar.css';
import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
               return (
                              <div>
                                             {/* Navbar */}
                                             <nav className="navbar">
                                                            <div className="navbar-container">
                                                                           <a href="https://flowbite.com/" className="navbar-logo">
                                                                                          <h1 className="logo text-black">
                                                                                                         JOM-<span className="logo-highlight">NOUY</span>
                                                                                          </h1>
                                                                           </a>
                                                                           <form className="form-search">
                                                                                          <div className="relative">
                                                                                                         <IoSearchOutline className="search-icon" />
                                                                                                         <input
                                                                                                                        type="search"
                                                                                                                        id="default-search"
                                                                                                                        className="search-input pl-12 peer"
                                                                                                                        placeholder="Search project, creator, and categories..."
                                                                                                         />
                                                                                          </div>
                                                                           </form>
                                                                           <div className="flex items-center gap-8">
                                                                                          <button type="button" className="navbar-button">
                                                                                                         Create project
                                                                                          </button>
                                                                                          <div className="profile">
                                                                                                         <p className="text-lg font-light text-black gap-8">Ranith</p>
                                                                                                         <img
                                                                                                                        className="avatar-image"
                                                                                                                        src="/img/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                                                                                                                        alt="Bordered avatar"
                                                                                                         />
                                                                                          </div>
                                                                           </div>
                                                            </div>
                                             </nav>

                                             <div className="categories-container  py-4 flex space-x-4">
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Music</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Sport</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Technologies</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Art</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Fashions</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Games</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Theater</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Publishing</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Design</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Food & Beverage</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Health & Fitness</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Education</a>
                                                            </div>
                                                            <div className="category-item">
                                                                           <a href="#" className="text-semibold">Photograph</a>
                                                            </div>

                                             </div>
                              </div>
               );
};

export default Navbar;
