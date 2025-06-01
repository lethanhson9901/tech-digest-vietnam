// src/components/Header.jsx (enhanced version)
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300' 
      : 'text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300';
  };

  const navigationItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      path: '/latest',
      label: 'Mới nhất',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      path: '/archive',
      label: 'Kho lưu trữ',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      path: '/combined-analysis',
      label: 'Phân tích tổng hợp',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M10 3a1 1 0 011 1v.5a1.5 1.5 0 001.5 1.5H13a1 1 0 110 2h-.5A1.5 1.5 0 0011 9.5V10a1 1 0 11-2 0v-.5A1.5 1.5 0 007.5 8H7a1 1 0 110-2h.5A1.5 1.5 0 009 4.5V4a1 1 0 011-1z" />
        </svg>
      )
    }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl ${
      isScrolled 
        ? 'shadow-xl border-b' 
        : ''
    }`}
    style={{
      background: isScrolled 
        ? isDarkMode 
          ? 'rgba(15, 23, 42, 0.95)' 
          : 'rgba(99, 102, 241, 0.95)'
        : 'var(--gradient-primary)',
      borderBottomColor: isScrolled 
        ? isDarkMode 
          ? 'var(--color-neutral-700)' 
          : 'var(--color-primary-400)'
        : 'transparent'
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:bg-white"
                   style={{ boxShadow: 'var(--shadow-accent)' }}>
                <svg className="h-8 w-8 transition-colors duration-300" 
                     style={{ color: 'var(--color-primary-600)' }}
                     viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Tech Digest Vietnam
              </h1>
              <p className="text-xs text-white/80 hidden md:block font-medium">
                🚀 Xu hướng công nghệ Việt Nam
              </p>
            </div>
          </Link>
          
          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <nav className="flex space-x-2">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={isActive(item.path)}
                  style={{
                    background: location.pathname === item.path 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                    boxShadow: location.pathname === item.path 
                      ? '0 8px 32px rgba(255, 255, 255, 0.1)' 
                      : 'none'
                  }}
                >
                  <span className="flex items-center space-x-2">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </span>
                </Link>
              ))}
            </nav>
            
            {/* Enhanced Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
              aria-label="Tìm kiếm"
              style={{ boxShadow: isSearchOpen ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Enhanced Dark Mode Toggle */}
            <div className="relative">
              <button 
                onClick={toggleDarkMode}
                className="relative flex items-center justify-center w-14 h-7 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ 
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, var(--color-neutral-700) 0%, var(--color-neutral-600) 100%)' 
                    : 'rgba(255, 255, 255, 0.2)'
                }}
                aria-label="Chuyển đổi chế độ tối"
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                  isDarkMode ? 'translate-x-3.5' : '-translate-x-3.5'
                }`}
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                  {isDarkMode ? (
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-primary-600)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-accent-orange)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Enhanced Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              aria-label="Tìm kiếm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Mobile Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-white transition-all duration-200"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              aria-label="Chuyển đổi chế độ tối"
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* Enhanced Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu p-2.5 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/10"
              aria-label="Menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`absolute left-0 top-5 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-2xl backdrop-blur-xl"
                 style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } group flex items-center px-4 py-3 text-base rounded-xl transition-all duration-200`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;