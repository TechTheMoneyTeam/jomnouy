import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Search } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'km' : 'en'));
    };

    const Header = () => (
        <header className="header">
            <nav className="nav-container">
                <Link to="/" className="logo">Jomnouy</Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${language === 'en' ? 'home-yellow' : ''}`}>Home</Link>
                    <Link to="/services" className="nav-link">Services</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </div>
                <div className="button-group">
                    <button className="login-button">Login</button>
                    <button className="search-button">
                        <Search />
                    </button>
                    {/* <Link to="/projectlist" className="view-projects">View Projects</Link> */}
                    <button onClick={toggleLanguage} className="language-button">
                        <span className="flag-icon">🇰🇭</span>{language === 'en' ? 'English' : 'ខ្មែរ'}
                    </button>

                </div>
            </nav>
        </header>
    );

    const Hero = () => (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-text">
                    <h1 className="hero-title">Find Your Next Investment Opportunity</h1>
                    <p className="hero-description">Connect with innovative startups and make impactful investments in Cambodia's future</p>
                    <Link to="/projectlist" className="hero-button">Start Now</Link>
                </div>
                <div className="hero-image-wrapper">
                    <img src="/api/placeholder/600/400" alt="Investment Concept" className="hero-image" />
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
                        <li><Link to="#" className="footer-link">Request Demo</Link></li>
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
                        <li className="footer-contact"><MapPin /> 417 Fifth Avenue, NY</li>
                        <li className="footer-contact"><Phone /> (855) 748-2422</li>
                        <li className="footer-contact"><Mail /> support@jomnouy.com</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Jom-nouy. All Rights Reserved.</p>
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
