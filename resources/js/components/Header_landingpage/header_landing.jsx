import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import DropdownMenu from "../Navbar/Projectdropdown"; 
import "./header_landing.css";

const Header = () => {
    const location = useLocation();
  
    const [isLoggedIn, setIsLoggedIn] = useState(false);



 
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

    return (
        <header className="header">
            <nav className="nav-container">
                <Link to="/" className="logo">
                    Jom<span className="nouy">nouy</span>
                </Link>
                
                <div className="nav-links">
                    <div className="nav-links-center">
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
                </div>
                
                {isLoggedIn && (
                    <div className="profile-container">
                        <DropdownMenu />
                    </div>
                )}

            </nav>
        </header>
    );
};

export default Header;