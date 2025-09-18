// src/components/Header.jsx (enhanced version)
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const dropdownRef = useRef(null);
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

  // Close dropdown on outside click (desktop only)
  useEffect(() => {
    // Only attach outside click for desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
      if (openDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = (e, item) => {
    if (!item.isDropdown) return;
    if (e.key === 'Enter' || e.key === ' ') {
      setOpenDropdown(item.label === openDropdown ? null : item.label);
    } else if (e.key === 'ArrowDown') {
      const first = document.querySelector(`#dropdown-${item.label} a`);
      if (first) first.focus();
    } else if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  // Highlight active dropdown item
  const isDropdownActive = (dropdownItems) => {
    return dropdownItems.some(sub => location.pathname.startsWith(sub.path));
  };

  // Navbar compact on scroll
  const navHeight = isScrolled ? '3.5rem' : '4.5rem';
  const navShadow = isScrolled ? '0 6px 24px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.08)';

  // Dropdown icons
  const dropdownIcons = {
    '/archive': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    ),
    '/combined-analysis': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    '/reddit-reports-archive': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ),
    '/hackernews-reports-archive': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    ),
    '/combined-analysis/latest': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    '/reddit-reports': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ),
    '/hackernews-reports': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    ),
    '/product-hunt-reports': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    '/product-hunt-reports-archive': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    '/weekly-tech-reports': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    ),
    '/weekly-tech-reports-archive': (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    )
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-inverse font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300 bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50' 
      : 'text-inverse opacity-80 hover:opacity-100 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50';
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
      label: 'Báo cáo',
      isDropdown: true,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      dropdownItems: [
        {
          path: '/combined-analysis/latest',
          label: 'Phân tích tổng hợp',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          path: '/reddit-reports',
          label: 'Reddit',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        },
        {
          path: '/hackernews-reports',
          label: 'Hacker News',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          )
        },
        {
          path: '/product-hunt-reports',
          label: 'Product Hunt',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          path: '/weekly-tech-reports',
          label: 'Tạp chí Công nghệ',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )
        }
      ]
    },
    {
      label: 'Kho lưu trữ',
      isDropdown: true,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      dropdownItems: [
        {
          path: '/archive',
          label: 'Báo cáo tổng hợp',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        },
        {
          path: '/combined-analysis',
          label: 'Phân tích chuyên sâu',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          path: '/reddit-reports-archive',
          label: 'Reddit',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        },
        {
          path: '/hackernews-reports-archive',
          label: 'Hacker News',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          )
        },
        {
          path: '/product-hunt-reports-archive',
          label: 'Product Hunt',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          path: '/weekly-tech-reports-archive',
          label: 'Tạp chí Công nghệ',
          icon: (
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl ${
      isScrolled 
        ? 'shadow-xl border-b' 
        : ''
    } ${isScrolled ? (isDarkMode ? 'bg-[rgba(15,23,42,0.95)] border-neutral-700' : 'bg-[rgba(99,102,241,0.95)] border-primary-400') : 'bg-gradient-primary'}`}
    style={{
      minHeight: navHeight,
      boxShadow: navShadow
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:bg-white shadow-accent-var">
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
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-inverse">
                Tech Digest Vietnam
              </h1>
              <p className="text-xs text-inverse hidden md:block font-medium opacity-80">
                🚀 Xu hướng công nghệ Việt Nam
              </p>
            </div>
          </Link>
          
          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <nav className="flex space-x-2">
              {navigationItems.map((item) =>
                item.isDropdown ? (
                  <div
                    key={item.label}
                    className="relative group hidden lg:block"
                    ref={dropdownRef}
                    tabIndex={0}
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onFocus={() => setOpenDropdown(item.label)}
                    onBlur={() => setOpenDropdown(null)}
                  >
                    <button
                      className={
                        isDropdownActive(item.dropdownItems)
                          ? 'bg-white/20 text-inverse font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50'
                          : 'text-inverse opacity-80 hover:opacity-100 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50'
                      }
                      style={{ background: 'transparent', boxShadow: 'none' }}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      onKeyDown={e => handleDropdownKeyDown(e, item)}
                    >
                      <span className="flex items-center space-x-2">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`dropdown-${item.label}`}
                      className={`absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 transition-all duration-200 ease-in-out pointer-events-auto border border-gray-200 dark:border-gray-700
                        ${openDropdown === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                      style={{
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        minWidth: 180
                      }}
                      role="menu"
                    >
                      {item.dropdownItems.map((sub, idx) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`flex items-center px-5 py-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium min-h-[44px] min-w-[44px] rounded-lg ${location.pathname.startsWith(sub.path) ? 'bg-gray-200 dark:bg-gray-600 font-semibold text-gray-900 dark:text-white' : ''}`}
                          tabIndex={0}
                          role="menuitem"
                          aria-current={location.pathname.startsWith(sub.path) ? 'page' : undefined}
                          onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}
                        >
                          {sub.icon || dropdownIcons[sub.path]}
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )
              )}
            </nav>
            
            {/* Enhanced Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-3 text-inverse opacity-80 hover:opacity-100 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
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
              className="p-2.5 text-inverse opacity-80 hover:opacity-100 hover:bg-white/10 rounded-xl transition-all duration-200"
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
              className="mobile-menu p-2.5 rounded-xl text-inverse transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/10"
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
              {navigationItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label} className="mb-2 block lg:hidden">
                    <button
                      className={`w-full flex items-center px-4 py-3 text-base rounded-xl transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white font-medium justify-between min-h-[44px] min-w-[44px] ${openDropdown === item.label ? 'bg-white/10' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === item.label ? null : item.label);
                      }}
                      aria-expanded={openDropdown === item.label}
                      type="button"
                    >
                      <span className="flex items-center space-x-2">
                        {item.icon}
                        {item.label}
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`pl-4 transition-all duration-200 ${openDropdown === item.label ? 'block' : 'hidden'}`}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 12
                      }}
                    >
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${location.pathname.startsWith(sub.path) ? 'bg-white/20 font-semibold' : ''}`}
                          style={{ color: 'white' }}
                          onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}
                        >
                          {dropdownIcons[sub.path]}
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${location.pathname === item.path
                      ? 'bg-white/20 text-inverse font-semibold'
                      : 'text-inverse opacity-80 hover:bg-white/10 hover:opacity-100'} group flex items-center px-4 py-3 text-base rounded-xl transition-all duration-200`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;