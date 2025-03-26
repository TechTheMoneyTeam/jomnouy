import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import "./header_landing.css";

const Header = () => {
    const location = useLocation();
    const [language, setLanguage] = useState("en");
    const [isScrolled, setIsScrolled] = useState(false);

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
            <nav
                className={`nav-container transition-[margin-top] duration-300 ${
                    isScrolled ? "top-0 shadow-md" : "mt-20"
                }`}
            >
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
            </nav>
        </div>
    );
};

export default Header;
