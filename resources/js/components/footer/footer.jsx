import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Linkedin, Twitter } from "lucide-react";
import "./footer.css";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const footerElement = footerRef.current;
      const elementPosition = footerElement.getBoundingClientRect().top;
      const screenPosition = window.innerHeight;

      // Add or remove visible class based on scroll position
      if (elementPosition < screenPosition - 50 && elementPosition > -footerElement.offsetHeight) {
        footerElement.classList.add("visible");
      } else {
        footerElement.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="footer fade-in">
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
            <li className="footer-contact">
              <MapPin className="inline-block mr-2" /> National Road 6a Bridge No2 IDRI Building CADT, PP
            </li>
            <li className="footer-contact">
              <Phone className="inline-block mr-2" /> (+855) 12 222 333
            </li>
            <li className="footer-contact">
              <Mail className="inline-block mr-2" /> support@jomnouy.com
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Jomnouy. All Rights Reserved.</p>
        <div className="footer-social">
          <Link to="https://t.me/jomnouy" className="social-icon"><Facebook /></Link>
          <Link to="https://t.me/jomnouy" className="social-icon"><Phone /></Link>
          <Link to="https://t.me/jomnouy" className="social-icon"><Twitter /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
