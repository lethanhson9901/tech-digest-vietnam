// src/components/TableOfContents.jsx (enhanced version)
import React, { useEffect, useState } from 'react';

const TableOfContents = ({ tocItems }) => {
  const [activeId, setActiveId] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto collapse on mobile
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3, h4');
      let currentActiveId = '';
      
      // Find the heading that's currently in view
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveId = heading.id;
        }
      });
      
      setActiveId(currentActiveId);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!tocItems || tocItems.length === 0) {
    return null;
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll to element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update URL hash without causing a jump
      window.history.pushState(null, null, `#${id}`);
      
      // On mobile, collapse the TOC after clicking
      if (isMobile) {
        setExpanded(false);
      }
    }
  };

  return (
    <div className="toc-container mb-6">
      <div 
        className="toc-heading flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Table of Contents
        </h2>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label={expanded ? 'Collapse' : 'Expand'}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        expanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
      }`}>
        <ul className="toc-list space-y-2">
          {tocItems.map((item, index) => (
            <li 
              key={index} 
              className={`toc-item ${item.level > 2 ? `toc-level-${item.level}` : ''} ${
                activeId === item.id ? 'bg-indigo-50 -mx-2 px-2 py-1 rounded' : ''
              }`}
            >
              <div className="flex items-start">
                <span className="toc-number text-indigo-600 font-medium mr-2 flex-shrink-0">
                  {item.number || (index + 1) + '.'}
                </span>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`toc-link text-left ${activeId === item.id ? 'text-indigo-700 font-medium' : 'text-gray-700 hover:text-indigo-600'}`}
                >
                  {item.title}
                  {item.subtitle && (
                    <span className="toc-subtitle block text-xs text-gray-500 mt-0.5">
                      {item.subtitle}
                    </span>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Progress indicator */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Reading progress</div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ 
                width: `${
                  activeId ? 
                  (tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length * 100 : 
                  0
                }%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
