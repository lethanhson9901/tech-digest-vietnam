// src/components/TableOfContents.jsx (enhanced version)
import React, { useEffect, useState } from 'react';

const TableOfContents = ({ content, isMobile = false, onItemClick }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!content) return;

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      extractedHeadings.push({
        id,
        text,
        level
      });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
        }
      });
      },
      {
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0
      }
    );

    // Wait a bit for the DOM to be ready
    const timeout = setTimeout(() => {
      const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      headingElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [content]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = isMobile ? -120 : -80; // Extra offset for mobile sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Update URL hash without triggering page jump
      window.history.pushState(null, null, `#${id}`);
      
      // Call onItemClick for mobile to close dropdown
      if (onItemClick) {
        onItemClick();
      }

      // Auto collapse on mobile after clicking
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    }
  };

  if (headings.length === 0) {
    return null;
  }

  // Mobile version (simplified)
  if (isMobile) {
    return (
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {headings.map((heading, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(heading.id)}
            className={`
              w-full text-left px-4 py-3 rounded-2xl text-sm transition-all duration-200 
              group hover:bg-emerald-100 relative
              ${heading.level === 1 ? 'font-semibold' : ''}
              ${heading.level === 2 ? 'ml-3 font-medium' : ''}
              ${heading.level === 3 ? 'ml-6' : ''}
              ${heading.level >= 4 ? 'ml-9 text-gray-600' : ''}
              ${activeId === heading.id 
                ? 'bg-emerald-100 text-emerald-800 shadow-sm ring-2 ring-emerald-200' 
                : 'text-gray-700 hover:text-emerald-700'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3 transition-all duration-200
                ${activeId === heading.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                }
              `}>
                {index + 1}
              </div>
              <span className="truncate font-medium">{heading.text}</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Desktop version (full featured)
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] border border-gray-100">
      {/* Header with toggle for mobile */}
      <div 
        className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100 cursor-pointer lg:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="p-2.5 bg-emerald-100 rounded-2xl mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          </div>
          Mục Lục
        </h3>
        {/* Toggle button for mobile */}
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-2xl hover:bg-gray-100"
          aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Navigation */}
      <nav className={`lg:block overflow-y-auto lg:max-h-[calc(100vh-12rem)] ${
        isCollapsed ? 'hidden' : 'block'
      }`}>
        <div className="p-5 space-y-2">
          {headings.map((heading, index) => (
            <button
              key={index} 
              onClick={() => scrollToSection(heading.id)}
              className={`
                w-full text-left px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 
                group hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-sm
                ${heading.level === 1 ? 'font-bold' : ''}
                ${heading.level === 2 ? 'ml-3 font-semibold' : ''}
                ${heading.level === 3 ? 'ml-6 font-medium' : ''}
                ${heading.level >= 4 ? 'ml-9 text-gray-600' : ''}
                ${activeId === heading.id 
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 shadow-md ring-2 ring-emerald-200 scale-105' 
                  : 'text-gray-700 hover:text-emerald-700'
                }
              `}
            >
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mr-3 transition-all duration-200
                  ${activeId === heading.id 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 group-hover:scale-110'
                  }
                `}>
                  {index + 1}
                </div>
                <span className="truncate">{heading.text}</span>
                {activeId === heading.id && (
                  <div className="ml-auto">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Enhanced Progress indicator */}
        <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-b-3xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-600">Tiến độ đọc</div>
            <div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
              {activeId ? 
                `${headings.findIndex(heading => heading.id === activeId) + 1} / ${headings.length}` :
                `0 / ${headings.length}`
              }
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-sm relative"
              style={{ 
                width: `${
                  activeId ? 
                  (headings.findIndex(heading => heading.id === activeId) + 1) / headings.length * 100 : 
                  0
                }%` 
              }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center bg-white/50 rounded-2xl py-2 px-3">
            {activeId ? 
              `Đang đọc: ${headings.find(h => h.id === activeId)?.text.substring(0, 30)}...` :
              'Chưa bắt đầu đọc'
            }
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TableOfContents;
