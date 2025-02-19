import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';


const Header = ({ language, toggleLanguage }) => {
    const location = useLocation();
    
    return (
        <header className="w-full bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <span className="text-2xl font-bold">Jom</span>
                    <span className="text-2xl font-bold text-orange-500">nouy</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-8">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'text-orange-500' : 'text-gray-600'} hover:text-orange-500 transition-colors`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/services" 
                        className={`nav-link ${location.pathname === '/services' ? 'text-orange-500' : 'text-gray-600'} hover:text-orange-500 transition-colors`}
                    >
                        Services
                    </Link>
                    <Link 
                        to="/about" 
                        className={`nav-link ${location.pathname === '/about' ? 'text-orange-500' : 'text-gray-600'} hover:text-orange-500 transition-colors`}
                    >
                        About
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button 
                        className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>
                    
                    <button 
                        onClick={toggleLanguage}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-200 hover:border-orange-500 transition-colors"
                    >
                        <span className="text-lg">🇰🇭</span>
                        <span className="text-sm">{language === 'en' ? 'English' : 'ខ្មែរ'}</span>
                    </button>

                    <Link 
                        to="/signup"
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;