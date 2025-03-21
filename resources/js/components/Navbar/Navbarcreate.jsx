import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { Eye } from "lucide-react";
import DropdownMenu from './Projectdropdown';

const Navbar3 = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username || 'Guest'); 
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


                        </div>
                    </form>
                    <div className="flex items-center gap-8 ">
                        <Link to="/#" className="login-button1">
                            <button style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Eye size={18} />
                                <span>Preview</span>
                            </button>
                        </Link>
                        <div className="profile flex items-center gap-4 cursor-pointer z-[999]">
                            <DropdownMenu />
                        </div>
                    </div>
                </div>
            </nav>
             <div className="navDivider"></div>


        </div>
    );
};

export default Navbar3;