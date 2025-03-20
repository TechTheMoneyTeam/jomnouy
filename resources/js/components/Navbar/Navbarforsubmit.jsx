import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownMenu from './Projectdropdown';
import { ChevronRight, Search } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const ref = useRef(null);


   

    // Load user data
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUsername(user.username || 'Guest'); 
                setUserType(user.user_type);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Function to render create project button conditionally
    const renderCreateProjectButton = () => {
        if (userType === 'investor') {
            return (
                <button 
                    className="create-btn opacity-50 cursor-not-allowed" 
                    disabled={true}
                    title="Investors cannot create projects"
                >
                    Create project
                </button>
            );
        } else {
            return (
                <Link to="/create">
                    <button className="create-btn hover:bg-orange-600">
                        Create project
                    </button>
                </Link>
            );
        }
    };

    return (
        <div className='mx-auto max-w-7xl m-12'>
            <nav className="max-w-screen-xl mx-auto flex items-center justify-between">
                <Link to="/projectlist1" onClick={() => {
                    setActiveTab('All');
                    localStorage.setItem('activeCategory', 'All');
                }}>
                    <div className="flex items-center">
                        <span className="text-3xl font-bold">
                            <span className="text-black">JOM</span>
                            <span className="text-orange-500">-NOUY</span>
                        </span>
                    </div>
                </Link>
                <div className="relative w-1/3">
                   
                </div>
                <div className="flex items-center space-x-4">
                    {renderCreateProjectButton()}
                    <div className="profile flex items-center gap-4 cursor-pointer z-[9999]">
                        <DropdownMenu username={username} />
                    </div>
                </div>
            </nav>
       
            <div className="navDivider"></div>
        </div>
    );
};

export default Navbar;