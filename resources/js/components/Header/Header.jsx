import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-content">
          <Link to="/" className="header-logo">Jomnouy</Link>
          <div className="header-actions">
            <button className="login-button">Login</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;