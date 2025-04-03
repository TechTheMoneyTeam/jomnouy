import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownMenu from './Projectdropdown';
import { ChevronRight, ChevronLeft, Search, X } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const ref = useRef(null);
    const searchRef = useRef(null);

    const categories = [
        'All', 'Technology', 'Art', 'Design', 'Film', 'Music', 'Publishing',
        'Games', 'Food', 'Fashion', 'Crafts', 'Photography', 'Comics',
        'Illustration', 'Theater', 'Education', 'Health', 'Environment'
    ];

    const scrollRight = () => {
        if (ref.current) {
            ref.current.scrollBy({
                left: 320,
                behavior: "smooth",
            });
            // Show left scroll button when scrolled right
            setShowLeftButton(true);
        }
    };

    const scrollLeft = () => {
        if (ref.current) {
            ref.current.scrollBy({
                left: -320,
                behavior: "smooth",
            });
            // Hide left button if scrolled back to start
            if (ref.current.scrollLeft <= 320) {
                setShowLeftButton(false);
            }
        }
    };

    // Check scroll position to update button visibility
    const handleScroll = () => {
        if (ref.current) {
            setShowLeftButton(ref.current.scrollLeft > 0);
        }
    };

    useEffect(() => {
        const scrollContainer = ref.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleCategoryClick = (category) => {
        setActiveTab(category);
        localStorage.setItem('activeCategory', category);

        if (category === 'All') {
            navigate('/projectlist1');
        } else {
            navigate(`/category/${category.toLowerCase()}`);
        }
    };

    const performSearch = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            // Fetch search results from backend
            const response = await axios.get('/api/search', {
                params: { query: query.toLowerCase() }
            });

            const results = response.data;
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);

            // Fallback local search if API fails
            const localResults = [
                ...categories
                    .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
                    .map(cat => ({ type: 'Category', name: cat })),
            ];

            setSearchResults(localResults);
        }
    };

    const debouncedSearch = React.useCallback(
        debounce((query) => performSearch(query), 300),
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleSearchResultClick = (result) => {
        if (result.type === 'Category') {
            if (result.name === 'All') {
                navigate('/projectlist1');
            } else {
                navigate(`/category/${result.name.toLowerCase()}`);
            }
        } else if (result.type === 'Project') {
            navigate(`/projects/${result.id}`);
        }

        setSearchQuery('');
        setSearchResults([]);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

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

        const path = location.pathname;
        if (path === '/projectlist1') {
            setActiveTab('All');
            localStorage.setItem('activeCategory', 'All');
            return;
        }

        if (path.startsWith('/category/')) {
            const urlCategory = path.split('/')[2];
            const matchedCategory = categories.find(
                cat => cat.toLowerCase() === urlCategory
            );

            if (matchedCategory) {
                setActiveTab(matchedCategory);
                localStorage.setItem('activeCategory', matchedCategory);
                return;
            }
        }

        const savedCategory = localStorage.getItem('activeCategory');
        if (savedCategory && categories.includes(savedCategory)) {
            setActiveTab(savedCategory);
        } else {
            setActiveTab('All');
            localStorage.setItem('activeCategory', 'All');
        }
    }, [location.pathname, categories]);

    const renderCreateProjectButton = () => {
        if (userType === 'investor') {
            return null; 
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

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    return (
        <div className='mx-auto max-w-7xl m-12 relative'>
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
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none ">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        placeholder="Search project and categories"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-3 flex items-center"
                        >
                            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {(isSearchFocused && searchResults.length > 0) && (
                        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSearchResultClick(result)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center z-50"
                                >
                                    <span>{result.name}</span>
                                    <span className="text-xs text-gray-500">{result.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {renderCreateProjectButton()}
                    <div className="profile flex items-center gap-4 cursor-pointer z-[9999]">
                        <DropdownMenu username={username} />
                    </div>
                </div>
            </nav>

            <div className="flex items-center pt-4">
                {showLeftButton && (
                    <button
                        className="p-2 mt-2 mr-2 text-black rounded-lg flex items-center justify-center hover:bg-orange-500/70 hover:text-white"
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
                <div 
                    className="cate-bar flex-1 overflow-x-auto z-40" 
                    ref={ref}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>
                        {`
                        .cate-bar::-webkit-scrollbar {
                            display: none;
                        }
                        `}
                    </style>
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