import React from 'react';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">How It Works</a></li>
              <li><a href="#" className="footer-link">Why Jomnouy</a></li>
              <li><a href="#" className="footer-link">Success Stories</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Partners</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Pricing</a></li>
              <li><a href="#" className="footer-link">Request Demo</a></li>
              <li><a href="#" className="footer-link">Customers</a></li>
              <li><a href="#" className="footer-link">Press</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Terms</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Intellectual Property Policy</a></li>
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
              <a href="#" className="footer-social-link">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="footer-social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;