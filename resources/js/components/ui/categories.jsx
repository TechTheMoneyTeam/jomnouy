import React from 'react';
import './categories.css';

const Navigation = () => {
    const categories = [
        "Arts",
        "Comics & Illustration",
        "Design & Tech",
        "Film",
        "Food & Craft",
        "Games",
        "Music",
        "Publishing"
    ];

    return (
        <nav className="w-full border-t border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-8">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href=""
                            className="text-gray-800 hover:text-gray-600 py-4 px-2 text-sm font-medium"
                        >
                            {category}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;