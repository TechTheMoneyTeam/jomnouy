import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
    const Header = () => {
        return (
            <header className="header">
                <nav className="header-nav">
                    <div className="header-content">
                        <Link to="/" className="header-logo">Jomnouy</Link>
                        <div className="header-actions">
                            <button className="login-button">Login</button>
                            <Link to="/projectlist" className="header-button">View Projects</Link> {/* Added Link to Project List */}
                        </div>
                    </div>
                </nav>
            </header>
        );
    };

    const Hero = () => {
        return (
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">Find Your Next Investment Opportunity</h1>
                            <p className="hero-description">Connect with innovative startups and make impactful investments in Cambodia's future</p>
                            <Link to="/projectlist" className="hero-button">Start Now</Link> {/* Added Link */}
                        </div>
                        <div className="hero-image-container">
                            <img src="/api/placeholder/600/400" alt="Investment Concept" className="hero-image" />
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const ProjectCard = ({ project }) => {
        return (
            <div className="project-card">
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-author">{project.author}</p>
                    <div className="project-metrics">
                        <span className="project-days">{project.daysLeft} days left</span>
                        <span className="project-funded">{project.funded}% Funded</span>
                    </div>
                </div>
            </div>
        );
    };

    const Footer = () => {
        return (
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3 className="footer-title">About Us</h3>
                            <ul className="footer-list">
                                <li><Link to="#" className="footer-link">How It Works</Link></li>
                                <li><Link to="#" className="footer-link">Why Jomnouy</Link></li>
                                <li><Link to="#" className="footer-link">Success Stories</Link></li>
                                <li><Link to="#" className="footer-link">Contact</Link></li>
                                <li><Link to="#" className="footer-link">Partners</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3 className="footer-title">Resources</h3>
                            <ul className="footer-list">
                                <li><Link to="#" className="footer-link">Pricing</Link></li>
                                <li><Link to="#" className="footer-link">Request Demo</Link></li>
                                <li><Link to="#" className="footer-link">Customers</Link></li>
                                <li><Link to="#" className="footer-link">Press</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3 className="footer-title">Terms</h3>
                            <ul className="footer-list">
                                <li><Link to="#" className="footer-link">Terms of Service</Link></li>
                                <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
                                <li><Link to="#" className="footer-link">Intellectual Property Policy</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3 className="footer-title">Contact</h3>
                            <ul className="footer-list">
                                <li className="footer-contact-item">
                                    <MapPin className="footer-icon" />
                                    <span>417 Fifth Avenue, #815, New York, NY 10016</span>
                                </li>
                                <li className="footer-contact-item">
                                    <Phone className="footer-icon" />
                                    <span>(855) 748-2422</span>
                                </li>
                                <li className="footer-contact-item">
                                    <Mail className="footer-icon" />
                                    <span>support@jomnouy.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="footer-bottom-content">
                            <p>© 2024 Jom-nouy. All Rights Reserved.</p>
                            <div className="footer-social">
                                <Link to="#" className="footer-social-link">
                                    <Facebook className="footer-social-icon" />
                                </Link>
                                <Link to="#" className="footer-social-link">
                                    <Linkedin className="footer-social-icon" />
                                </Link>
                                <Link to="#" className="footer-social-link">
                                    <Twitter className="footer-social-icon" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    };

    return (
        <>
            <Header />
            <Hero />
            {/* Add ProjectCard components here as needed */}
            <Footer />
        </>
    );
};

export default Home;