import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import "./header_landing.css";

const Header = () => {
    const location = useLocation();
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === "en" ? "km" : "en"));
    };

    return (
        <header className="header">
            <nav className="nav-container">
                <Link to="/" className="logo">
                    Jom<span className="nouy">nouy</span>
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
                    <Link to="/login" className="login-button">
                        <span>Login</span>
                    </Link>
                </div>
                <div className="button-group">
                    <button
                        onClick={toggleLanguage}
                        className="language-button"
                    >
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;