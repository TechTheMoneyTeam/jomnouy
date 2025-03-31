import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import DropdownMenu from "../Navbar/Projectdropdown";
import "./header_landing.css";

const Header = () => {
    const location = useLocation();
    const [language, setLanguage] = useState("en");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Check login status
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    
    // Scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    
    return (
        <div className="nav-wrapper">
            <nav className={`nav-container transition-all duration-300 ${isScrolled ? "top-0 shadow-md" : "top-2"}`}>
                <Link to="/" className="logo drop-shadow-lg">
                    JOM-<span className="nouy">NOUY</span>
                </Link>
                
                <div className="nav-links">
                    <ScrollLink
                        to="home"
                        smooth={true}
                        duration={500}
                        spy={true}
                        offset={-70}
                        className="nav-link"
                        activeClass="active-link"
                    >
                        Home
                    </ScrollLink>
                    <ScrollLink
                        to="services"
                        smooth={true}
                        duration={500}
                        spy={true}
                        offset={-70}
                        className="nav-link"
                        activeClass="active-link"
                    >
                        Services
                    </ScrollLink>
                    <ScrollLink
                        to="about"
                        smooth={true}
                        duration={500}
                        spy={true}
                        offset={-70}
                        className="nav-link"
                        activeClass="active-link"
                    >
                        About
                    </ScrollLink>
                    
                    {!isLoggedIn && (
                        <Link to="/login" className="login-button">
                            <span>Login</span>
                        </Link>
                    )}
                </div>
                
                {isLoggedIn && (
                    <div className="profile-container">
                        <DropdownMenu />
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Header;