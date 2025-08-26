// src/components/EnhancedContent.jsx (enhanced version)
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TableOfContents from './TableOfContents';

const EnhancedContent = ({ title, date, sections, tocItems }) => {
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to it
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
    
    // Show back to top button when scrolled down
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      // Find active section for highlighting
      const sections = document.querySelectorAll('.section-highlight');
      let currentSection = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Process content to remove HTML ID tags and replace &nbsp; with newlines
  const processContent = (content) => {
    if (!content) return '';
    
    return content
      // Replace &nbsp; with newline
      .replace(/&nbsp;/g, '\n')
      .replace(/<a\s+id="([^"]+)"><\/a>/g, '')
      .replace(/<a\s+id="([^"]+)">(.+?)<\/a>/g, '$2')
      .replace(/(.+?)<a id="(.+?)"><\/a>/g, '$1');
  };

  // Custom components for markdown rendering
  const components = {
    // Improve heading styles with auto-ID generation
    h2: ({ node, ...props }) => {
      const text = props.children.toString();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return (
        <h2 
          id={id} 
          className="text-2xl font-bold text-primary mt-8 mb-4 pb-2 border-b border-gray-200 group flex items-center" 
          {...props} 
        >
          {props.children}
          <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </a>
        </h2>
      );
    },
    h3: ({ node, ...props }) => {
      const id = props.children.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return (
        <h3 
          id={id} 
          className="text-xl font-semibold text-primary mt-6 mb-3 group flex items-center" 
          {...props} 
        >
          {props.children}
          <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </a>
        </h3>
      );
    },
    // Style code blocks
    code: ({ node, inline, className, children, ...props }) => {
      // Loại bỏ tất cả dấu backticks từ nội dung
      const cleanContent = String(children).replace(/`/g, '');
      
      // Luôn sử dụng inline formatting đơn giản với font phù hợp tiếng Việt
      return (
        <code 
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm border border-gray-200 dark:border-gray-700 font-['JetBrains_Mono',_'Fira_Code',_'Cascadia_Code',_'SF_Mono',_'Monaco',_'Consolas',_'Liberation_Mono',_'Menlo',_'Courier',_'monospace']" 
          style={{
            fontFeatureSettings: '"liga" 1, "calt" 1',
            fontVariantLigatures: 'contextual',
            letterSpacing: '-0.01em'
          }}
          {...props}
        >
          {cleanContent}
        </code>
      );
    },
    // Style links as "Read more"
    a: ({ node, href, children, ...props }) => {
      if (children[0] === 'Read more') {
        return (
          <a 
            href={href} 
            className="inline-flex items-center mt-2 text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        );
      }
      
      // Check if it's an external link
      const isExternal = href?.startsWith('http');
      
      return (
        <a 
          href={href} 
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
          {isExternal && (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3.5 w-3.5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          )}
        </a>
      );
    },
    // Style blockquotes
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-indigo-300 pl-4 py-2 my-4 bg-indigo-50 rounded-r-md text-secondary italic" {...props} />
    ),
    // Style lists
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="text-secondary" {...props} />
    ),
  };

  // Add a Back to Top button component
  const BackToTop = () => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return (
      <>
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {date && (
            <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
              {date}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Table of Contents */}
        <div className="lg:flex lg:gap-8">
          <div className="lg:w-1/4 mb-4 lg:mb-0">
            {tocItems && tocItems.length > 0 && (
              <div className="lg:sticky lg:top-4">
                <TableOfContents tocItems={tocItems} />
              </div>
            )}
          </div>

          <div className="lg:w-3/4">
            {/* Sections */}
            {sections.map((section, index) => (
              <div key={index} id={section.id} className={`mt-8 section-highlight ${section.isToc ? 'hidden' : ''}`}>
                <h2 className="text-2xl font-bold text-primary mb-4 pb-2 border-b border-gray-200">
                  {section.title}
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={components}
                  >
                    {processContent(section.content)}
                  </ReactMarkdown>
                </div>
                {index < sections.length - 1 && !sections[index + 1].isToc && (
                  <hr className="my-8 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default EnhancedContent;