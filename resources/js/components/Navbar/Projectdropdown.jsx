import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null); 

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username);
            fetchProfileData(user.username);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfileData = async (username) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/profile?username=${username}`);
            const data = await response.json();
            
            if (data.success && data.profile.profile_picture) {
                setProfilePicture(data.profile.profile_picture);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getProfileImageSrc = () => {
        if (loading) {
            return "/img/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"; // Use default while loading
        }
        
        return profilePicture ? `/storage/${profilePicture}` : "/img/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"; // Default image
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={toggleDropdown} className="flex items-center cursor-pointer">
                <p className="text-lg font-light text-black">{username}</p>
                <img
                    className="avatar-image w-10 h-10 rounded-full object-cover ml-2"
                    src={getProfileImageSrc()}
                    alt={`${username}'s avatar`}
                    style={{ border: '2px solid #ccc' }} // Optional: Add a border for better visibility
                />
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-100">
                    <Link to="/my-project" className="block px-4 py-2 hover:bg-gray-200 transition">
                        My Project
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Profile
                    </Link>
                    <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Favorite
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Settings
                    </Link>
                    <Link to="/dashboardInvestor" className="block px-4 py-2 hover:bg-gray-200 transition">
                        Dashboard
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