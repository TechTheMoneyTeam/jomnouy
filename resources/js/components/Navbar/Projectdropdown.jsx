import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username);
        }
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
                <p className="text-lg font-light text-black">{username}</p>
                <img
                    className="avatar-image w-10 h-10 rounded-full object-cover ml-2"
                    src="/img/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                    alt="User avatar"
                />
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                    <Link to="/my-project" className="block px-4 py-2 hover:bg-gray-200 transition">
                        My Project
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Settings
                    </Link>
                    <Link to="/logout" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Log out
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;