import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Search } from 'lucide-react';
import './Home.css';


const Home = () => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'km' : 'en'));
    };
    const Header = () => {
        const location = useLocation();

        return (
            <header className="header">
                <nav className="nav-container">
                    <Link to="/" className="logo">Jom<span className='nouy '>nouy</span></Link>
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/services"
                            className={`nav-link ${location.pathname === '/services' ? 'active-link' : ''}`}
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${location.pathname === '/about' ? 'active-link' : ''}`}
                        >
                            About
                        </Link>
                        <Link to="/login" className="login-button">
                            <button><span>Login</span></button>
                        </Link>
                    </div>
                    <div className="button-group">

                        <button className="search-button">
                            <Search />
                        </button>
                        <button onClick={toggleLanguage} className="language-button">
                            <span className="flag-icon">🇰🇭</span>{language === 'en' ? 'English' : 'ខ្មែរ'}
                        </button>
                    </div>
                </nav>
            </header>
        );
    }

    const Hero = () => (
        <section className="hero">
            <div className="hero-background"></div>
            <div className="hero-content">
                <div className="hero-text-section">
                    <h1 className="hero-title">ផ្លាស់ប្តូរជីវិត</h1>
                    <p className="hero-description">របស់អ្នក</p>
                    <p className="hero-description">ជាមួយ Jom-nouy</p>
                    <Link to="/signup" className="hero-button">
                        <button><span>ចាប់ផ្តើមឥឡូវនេះ ➜</span></button>
                    </Link>

                </div>
                <div className="hero-image-wrapper">
                    <img
                        src="/img/hero.png"
                        alt="Illustration of investment opportunities"
                        className="analytics-image"
                    />
                </div>
            </div>
        </section>
    );



    const Footer = () => (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <h3 className="footer-title">About Us</h3>
                    <ul className="footer-list">
                        <li><Link to="#" className="footer-link">How It Works</Link></li>
                        <li><Link to="#" className="footer-link">Why Jomnouy</Link></li>
                        <li><Link to="#" className="footer-link">Success Stories</Link></li>
                        <li><Link to="#" className="footer-link">Contact</Link></li>
                        <li><Link to="#" className="footer-link">Partners</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Resources</h3>
                    <ul className="footer-list">
                        <li><Link to="#" className="footer-link">Pricing</Link></li>
                        <li>     <Link
                            to="/projectsubmit"
                        
                        >
                            Submit Project
                        </Link></li>
                        <li><Link to="#" className="footer-link">Customers</Link></li>
                        <li><Link to="#" className="footer-link">Press</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Terms</h3>
                    <ul className="footer-list">
                        <li><Link to="#" className="footer-link">Terms of Service</Link></li>
                        <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
                        <li><Link to="#" className="footer-link">Intellectual Property Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Contact</h3>
                    <ul className="footer-list">
                        <li className="footer-contact"><MapPin /> National Road 6a Bridge No2 IDRI Building CADT, PP</li>
                        <li className="footer-contact"><Phone /> (+855) 12 222 333</li>
                        <li className="footer-contact"><Mail /> support@jomnouy.com</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Jomnouy. All Rights Reserved.</p>
                <div className="footer-social">
                    <Link to="#" className="social-icon"><Facebook /></Link>
                    <Link to="#" className="social-icon"><Linkedin /></Link>
                    <Link to="#" className="social-icon"><Twitter /></Link>
                </div>
            </div>
        </footer>
    );

    return (
        <>
            <Header />
            <Hero />
            <Footer />

        </>
    );
};

export default Home;
