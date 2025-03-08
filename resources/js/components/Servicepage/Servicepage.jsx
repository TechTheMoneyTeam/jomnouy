import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Facebook,
    Linkedin,
    Twitter,
    Phone,
    Mail,
    MapPin,
    Search,
} from "lucide-react";
import "./Service.css";
import { colors } from "laravel-mix/src/Log";

const Service = () => {
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "km" : "en"));
    };

    // Intersection Observer to detect when service cards come into view
    useEffect(() => {
        const heroService = document.querySelector('.hero-service');
        const heroContent = document.querySelector('.hero-content-service');
        const serviceCards = document.querySelectorAll('.service-card'); // Select all service cards

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === heroService) {
                    if (entry.isIntersecting) {
                        heroService.classList.add('show-hero');
                    } else {
                        heroService.classList.remove('show-hero');
                    }
                }

                if (entry.target === heroContent) {
                    if (entry.isIntersecting) {
                        heroContent.classList.add('show-hero');
                    } else {
                        heroContent.classList.remove('show-hero');
                    }
                }

                // Observe each service card for visibility
                if (entry.target.classList.contains('service-card')) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show'); // Add the show class to animate the card
                    } else {
                        entry.target.classList.remove('show'); // Remove the show class when it's out of view
                    }
                }
            });
        }, {
            threshold: 0.5,  // Adjust threshold as needed
        });

        // Observe the elements
        if (heroService) observer.observe(heroService);
        if (heroContent) observer.observe(heroContent);
        serviceCards.forEach(card => {
            observer.observe(card); // Observe each service card
        });

        // Cleanup on unmount
        return () => {
            if (heroService) observer.unobserve(heroService);
            if (heroContent) observer.unobserve(heroContent);
            serviceCards.forEach(card => {
                observer.unobserve(card); // Unobserve each service card
            });
        };
    }, []);

    const Header = () => {
        const location = useLocation();
    
        return (
            <header className="header">
                <nav className="nav-container">
                    <Link to="/" className="logo">
                        Jom<span className="nouy">nouy</span>
                    </Link>
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === "/home" ? "active-link" : ""}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/services"
                            className={`nav-link ${location.pathname === "/services" ? "active-link" : ""}`}
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${location.pathname === "/about" ? "active-link" : ""}`}
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
                            <span className="flag-icon">🇰🇭</span>
                            {language === "en" ? "English" : "ខ្មែរ"}
                        </button>
                    </div>
                </nav>
            </header>
        );
    };

    const Hero = () => (
        <div className="hero-service">
            <img src="/img/serviceimg.png" alt="Hero Background" />
            <div className="hero-content-service">
                <h1 className="hero-title1">Opportunities don't happen.</h1>
                <h1 className="hero-title2">You create them.</h1>
                <p className="hero-text1">
                    Connecting creators with the companies looking to sponsor them.
                </p>

                <div className="hero-buttons">

                    <Link to="/signup" className="hero-btn-primary1">
                        <button><span>Become a member</span></button>
                    </Link>


                    <Link to="/about" className="hero-btn-secondary1">
                        <button><span>Learn More</span></button>
                    </Link>
                </div>
            </div>
        </div>
    );

    const Services = () => (
        <div className="services-section">
            <h2 className="services-title">Our Services</h2>
            <div className="services-container">
                <div className="service-card">
                    <img src="/img/findsponsor.png" className="service-image" />
                    <h3 className="service-title">Find Sponsors</h3>
                    <p className="service-description">
                        Explore our Sponsorship List featuring companies ready to sponsor creators.
                    </p>
                </div>
                <div className="service-card">
                    <img src="/img/investor.png" className="service-image" />
                    <h3 className="service-title">Investor</h3>
                    <p className="service-description">
                        Check out our Sponsorship List of companies seeking creators to sponsor.                    </p>
                </div>
                <div className="service-card">
                    <img src="/img/projectstartup.png" className="service-image" />
                    <h3 className="service-title">Project Start-Up</h3>
                    <p className="service-description">
                        Explore our Sponsorship List—companies eager to sponsor creators.                    </p>
                </div>
            </div>
        </div>
    );
    const About = () => (
        <div className="about-section">
            <h2 className="about-title">Who Uses Looking For Sponsor?</h2>
            <p className="about-text">
                ជំនួយ-Jom<span>nouy</span> is a platform that connects creators with companies looking to sponsor them. We help creators find sponsors and investors to support their projects. Our mission is to empower creators to turn their ideas into reality by providing them with the resources they need to succeed.
            </p>
            <div className="about-container">
                <div className="about-card">
                    <img src="/img/creator.png" className="about-image" />
                    <h3 className="about-card-title">Creators</h3>
                    <p className="about-card-text">
                        Find sponsors and investors to support your projects.
                    </p>
                </div>
                <div className="about-card">
                    <img src="/img/creator.png" className="about-image" />
                    <h3 className="about-card-title">Creators</h3>
                    <p className="about-card-text">
                        Find sponsors and investors to support your projects.
                    </p>
                </div>
                <div className="about-card">
                    <img src="/img/creator.png" className="about-image" />

                    <h3 className="about-card-title">Creators</h3>
                    <p className="about-card-text">
                        Find sponsors and investors to support your projects.
                    </p>
                </div>
                <div className="about-card">
                    <img src="/img/investor.png" className="about-image" />
                    <h3 className="about-card-title">Creators</h3>
                    <p className="about-card-text">
                        Find sponsors and investors to support your projects.
                    </p>
                </div>


            </div>
        </div>





    );

    const Footer = () => (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <h3 className="footer-title">About Us</h3>
                    <ul className="footer-list">
                        <li>
                            <Link to="#" className="footer-link">How It Works</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Why Jomnouy</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Success Stories</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Contact</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Partners</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Resources</h3>
                    <ul className="footer-list">
                        <li>
                            <Link to="#" className="footer-link">Pricing</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Request Demo</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Customers</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Press</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Terms</h3>
                    <ul className="footer-list">
                        <li>
                            <Link to="#" className="footer-link">Terms of Service</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="#" className="footer-link">Intellectual Property Policy</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-title">Contact</h3>
                    <ul className="footer-list">
                        <li className="footer-contact">
                            <MapPin /> National Road 6a Bridge No2 IDRI Building CADT, PP
                        </li>
                        <li className="footer-contact">
                            <Phone /> (+855) 12 222 333
                        </li>
                        <li className="footer-contact">
                            <Mail /> support@jomnouy.com
                        </li>
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
            <Services />
            <About />
            <Footer />

        </>
    );
};

export default Service;
