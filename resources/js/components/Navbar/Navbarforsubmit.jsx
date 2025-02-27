import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import DropdownMenu from './Projectdropdown';

const Navbar2 = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username); 
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
                        <Link to="/create" className="login-button">
                            <button><span>Create Project</span></button>
                        </Link>
                        <div className="profile flex items-center gap-4 cursor-pointer">
                            <DropdownMenu />
                        </div>
                    </div>
                </div>
            </nav>


        </div>
    );
};

export default Navbar2;