// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ children }) {
  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="logo-text">Tech Digest <span className="highlight">Vietnam</span></span>
          </Link>
        </div>
        
        <nav className="main-nav">
          <Link to="/" className="nav-item">Latest</Link>
          <Link to="/archive" className="nav-item">Archive</Link>
          <Link to="/about" className="nav-item">About</Link>
        </nav>
        
        <div className="header-right">
          {children}
        </div>
      </div>
    </header>
  );
}

export default Header;
