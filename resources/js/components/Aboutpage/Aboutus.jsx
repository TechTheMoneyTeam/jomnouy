import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Search } from 'lucide-react';
import './Aboutus.css';

const About = () => {
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
              className={`nav-link ${location.pathname === '/home' ? 'active-link' : ''}`}
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
            <button className="login-button"><span>Login</span></button>
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

  const ImageSections = () => (
    <div className="w-full flex flex-col gap-8">

      <div className="w-full h-[400px] relative">
        <img
          src="/img/about.png"
          alt="About 1"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>


      <div className="w-full h-[500px] relative">
        <img
          src="/img/bottomabout.png"
          alt="About 2"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        <Link to="https://t.me/jomnouy" className="hero-button1">
          <button><span>Contact Us</span></button>
        </Link>

      </div>
    </div>
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ImageSections />
      </main>
      <Footer />
    </div>
  );
};

export default About;
