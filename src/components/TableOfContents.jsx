// src/components/TableOfContents.jsx (enhanced version)
import React, { useEffect, useState } from 'react';

const TableOfContents = ({ content, isMobile = false, onItemClick }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!content) return;

    // Extract headings from markdown content - chỉ lấy format "## #" (chính xác)
    const headingRegex = /^##\s+#\s+(.+)$/gm;
    const extractedHeadings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      extractedHeadings.push({
        id,
        text,
        level: 2 // Tất cả đều là level 2 vì format "## #"
      });
    }

    // Chỉ lấy 14 report lớn nhất
    const limitedHeadings = extractedHeadings.slice(0, 14);
    setHeadings(limitedHeadings);
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
      const headingElements = document.querySelectorAll('h2[id]');
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
              group hover:bg-emerald-100 dark:hover:bg-emerald-800 relative
              ${activeId === heading.id 
                ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-sm ring-2 ring-emerald-200 dark:ring-emerald-600' 
                : 'text-secondary dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3 transition-all duration-200
                ${activeId === heading.id 
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg' 
                  : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700'
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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] border border-neutral-100 dark:border-gray-700">
      {/* Header with toggle for mobile */}
      <div 
        className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 border-b border-neutral-100 dark:border-gray-700 cursor-pointer lg:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-bold text-primary dark:text-white flex items-center">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-800 rounded-2xl mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          </div>
          Mục Lục (14 Report Lớn Nhất)
        </h3>
        {/* Toggle button for mobile */}
        <button 
          className="lg:hidden text-muted dark:text-gray-300 hover:text-secondary dark:hover:text-white transition-colors p-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-gray-700"
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
                group hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-800 dark:hover:to-teal-800 hover:shadow-sm
                ${activeId === heading.id 
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 text-emerald-800 dark:text-white shadow-md ring-2 ring-emerald-200 dark:ring-emerald-600 scale-105' 
                  : 'text-secondary dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300'
                }
              `}
            >
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mr-3 transition-all duration-200
                  ${activeId === heading.id 
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg' 
                    : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700 group-hover:scale-110'
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
        <div className="p-5 border-t border-neutral-100 dark:border-gray-700 bg-gradient-to-r from-neutral-50 to-emerald-50 dark:from-gray-800 dark:to-emerald-900 rounded-b-3xl">
            <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-secondary dark:text-gray-300">Tiến độ đọc</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800 px-2.5 py-1 rounded-full">
              {activeId ? 
                `${headings.findIndex(heading => heading.id === activeId) + 1} / ${headings.length}` :
                `0 / ${headings.length}`
              }
            </div>
          </div>
          <div className="h-3 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
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
          <div className="text-xs text-muted mt-2 text-center bg-white/50 rounded-2xl py-2 px-3">
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
