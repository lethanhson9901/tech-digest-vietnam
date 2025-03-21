// src/components/Header.js
import React from 'react';

function Header({ children }) {
  return (
    <header>
      <a href="/" className="logo">
        <div className="logo-icon">T</div>
        Tech Digest Vietnam
      </a>
      {children}
    </header>
  );
}

export default Header;
