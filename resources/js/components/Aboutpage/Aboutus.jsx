import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Search } from 'lucide-react';
import './Aboutus.css';
import Footer from "../footer/footer";

const Header = () => {
  const location = useLocation();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'km' : 'en'));
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">Jom<span className='nouy'>nouy</span></Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/home' ? 'active-link' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`nav-link ${location.pathname === '/service' ? 'active-link' : ''}`}
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
            <span>Login</span>
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
};

const ImageSections = () => (
  <div className="w-full flex flex-col gap-8">
    <div className="w-full h-[300px] relative">
      <img
        src="/img/about.png"
        alt="About 1"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
    </div>

    <div className="w-3/4 h-[200px] relative mx-auto">
      <img
        src="/img/bottomabout.png"
        alt="About 2"
        className="w-max-content h-[200px] object-cover"
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <Link to="https://t.me/jomnouy" className="hero-button1">
        <button><span>Contact Us</span></button>
      </Link>
    </div>
  </div>
);

const About = () => {
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
