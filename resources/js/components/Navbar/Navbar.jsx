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

    const categories = [
        'All', 'Technology', 'Art', 'Design', 'Film', 'Music', 'Publishing',
        'Games', 'Food', 'Fashion', 'Crafts', 'Photography', 'Comics',
        'Illustration', 'Theater', 'Education', 'Health', 'Environment'
    ];

    // Scroll right function
    const scrollRight = () => {
        if (ref.current) {
            ref.current.scrollBy({
                left: 320,
                behavior: "smooth",
            });
        }
    };
    const handleCategoryClick = (category) => {
        setActiveTab(category);

        localStorage.setItem('activeCategory', category);

        if (category === 'All') {
            navigate('/projectlist1');
        } else {
            navigate(`/category/${category.toLowerCase()}`);
        }
    };
    useEffect(() => {
        const path = location.pathname;

        // Check if we're on the "All" category page
        if (path === '/projectlist1') {
            setActiveTab('All');
            localStorage.setItem('activeCategory', 'All');
            return;
        }

        // Check if we're on a specific category page
        if (path.startsWith('/category/')) {
            const urlCategory = path.split('/')[2];
            // Find the matching category (case-insensitive)
            const matchedCategory = categories.find(
                cat => cat.toLowerCase() === urlCategory
            );

            if (matchedCategory) {
                setActiveTab(matchedCategory);
                localStorage.setItem('activeCategory', matchedCategory);
                return;
            }
        }

        // If neither of the above, fallback to localStorage
        const savedCategory = localStorage.getItem('activeCategory');
        if (savedCategory && categories.includes(savedCategory)) {
            setActiveTab(savedCategory);
        } else {
            setActiveTab('All');
            localStorage.setItem('activeCategory', 'All');
        }
    }, [location.pathname, categories]);

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
                <Link to="/" onClick={() => {
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
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search project, creator, and categories"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    {renderCreateProjectButton()}
                    <div className="profile flex items-center gap-4 cursor-pointer z-[9999]">
                        <DropdownMenu username={username} />
                    </div>
                </div>
            </nav>
            <div className="flex items-center pt-4">
                <div className="cate-bar flex-1 overflow-x-auto scrollbar-hide" ref={ref}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`cateBtn ${activeTab === category ? "cateBtn-active" : "cateBtn-inactive"}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <button
                    className="p-2 mt-2 ml-2 text-black rounded-lg flex items-center justify-center hover:bg-orange-500/70 hover:text-white"
                    onClick={scrollRight}
                    aria-label="Scroll right"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Navbar;