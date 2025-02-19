import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';

const SignupForm = () => {
    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        bio: '',
        contact_info: ''
    });

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [language, setLanguage] = useState('en');

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) newErrors.username = ['Username is required'];
        if (!formData.email) newErrors.email = ['Email is required'];
        if (!formData.password) newErrors.password = ['Password is required'];
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = ['Passwords do not match'];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Event handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'km' : 'en');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!validateForm()) {
            setMessage('Please check all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const response = await axios.post('/api/signup', submitData);
            setMessage('Account created successfully! Redirecting...');
            // You could add navigation here
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage(errorMessage);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Input field component
    const InputField = ({ label, name, type = 'text', placeholder, required = false }) => (
        <div>
            <label className="block text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name][0]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="w-full bg-white shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold">Jom</span>
                        <span className="text-2xl font-bold text-orange-500">nouy</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'Services', 'About'].map(item => (
                            <Link 
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-gray-600 hover:text-orange-500 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
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
                    </div>
                </nav>
            </header>

            {/* Main Form */}
            <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField 
                        label="Username"
                        name="username"
                        placeholder="Enter Username"
                        required
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <InputField 
                                label="First Name"
                                name="first_name"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="flex-1">
                            <InputField 
                                label="Last Name"
                                name="last_name"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <InputField 
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        required
                    />

                    <InputField 
                        label="Phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter Phone Number"
                    />

                    <InputField 
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        required
                    />

                    <InputField 
                        label="Re-Enter Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                    />

                    <button 
                        type="submit" 
                        className={`w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {message && (
                        <p className={`text-center ${
                            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {message}
                        </p>
                    )}

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Already have account? 
                            <Link to="/login" className="text-orange-500 ml-1 hover:text-orange-600">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 6.016 4.432 10.984 10.206 11.852V15.18H7.237v-3.154h2.969V9.927c0-3.475 1.693-5 4.581-5 1.383 0 2.115.103 2.461.149v2.753h-1.97c-1.226 0-1.654 1.163-1.654 2.473v1.724h3.593l-.487 3.154h-3.106v8.697C19.481 23.083 24 18.075 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        CONTINUE WITH FACEBOOK
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;