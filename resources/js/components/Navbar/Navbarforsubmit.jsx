import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Navbar2 = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username); // Assuming the username is in the user object
        }
    }, []);

    return (
        <div style={{ margin: '60px 200px 0px 200px' }}>
            <nav className="navbar">
                <div className="navbar-container">
                    <a href="/projectlist1" className="navbar-logo">
                        <h1 className="logo text-black">
                            JOM-<span className="logo-highlight">NOUY</span>
                        </h1>
                    </a>
                    <form className="form-search">
                        <div className="relative">
                            <IoSearchOutline className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] w-6 h-6 peer-focus:text-black" />
                            <input
                                type="search"
                                id="default-search"
                                className="search-input pee w-[500px] placeholder-[#C0C0C0] py-2.5 pl-10 text-sm text-[#333] border border-[#D7DBDD] rounded-lg focus:ring-[#ebab6c] focus:border-red-500 transition-all duration-300 ease-in-outr"
                                placeholder="Search project, creator, and categories..."
                            />
                        </div>
                    </form>
                    <div className="flex items-center gap-8">
                        <Link to="/projectsubmit" className="login-button">
                            <button><span>Create Project</span></button>
                        </Link>
                        <Link to="/profile" className="block hover:opacity-80 transition-opacity">
                            <div className="profile flex items-center gap-4 cursor-pointer">
                                <p className="text-lg font-light text-black">{username}</p>
                                <img
                                    className="avatar-image w-10 h-10 rounded-full object-cover"
                                    src="/img/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                                    alt="User avatar"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>


        </div>
    );
};

export default Navbar2;