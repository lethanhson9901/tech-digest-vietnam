// src/components/MarkdownRenderer.jsx
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarkdownRenderer = ({ content, autoTOC = false }) => {

  // Pre-process content to remove visible HTML ID tags, backticks, and replace &nbsp; with newlines
  const processContent = (content) => {
    if (!content) return '';
    
    let processedContent = content
      // Convert literal "\n" sequences to real newlines
      .replace(/\\n/g, '\n')
      // Replace &nbsp; with newline
      .replace(/&nbsp;/g, '\n')
      // Remove markdown heading IDs like {#heading-id}
      .replace(/\s*\{#[^}]+\}/g, '')
      // Replace patterns like <a id="something"></a> with empty string
      .replace(/<a\s+id="([^"]+)"><\/a>/g, '')
      // Replace patterns like <a id="something">text</a> with just text
      .replace(/<a\s+id="([^"]+)">(.+?)<\/a>/g, '$2')
      // Clean up heading IDs that appear in the rendered text
      .replace(/(.+?)<a id="(.+?)"><\/a>/g, '$1')
      // Remove any remaining id="something" from the text
      .replace(/<a id="([^"]+)">/g, '')
      .replace(/<\/a>/g, '');
    
    return processedContent;
  };

  // Handle smooth scrolling for TOC links
  useEffect(() => {
    const handleTOCClick = (event) => {
      const target = event.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        event.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        console.log('TOC Click - Target ID:', targetId); // Debug log
        
        // Try to find element by ID
        let targetElement = document.getElementById(targetId);
        
        // If not found, try to find by partial match or similar ID
        if (!targetElement) {
          const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          for (let heading of allHeadings) {
            if (heading.id) {
              // Try exact match first
              if (heading.id === targetId) {
                targetElement = heading;
                break;
              }
              // Try partial match (remove all dashes and compare)
              const headingIdClean = heading.id.replace(/-/g, '');
              const targetIdClean = targetId.replace(/-/g, '');
              if (headingIdClean === targetIdClean || headingIdClean.includes(targetIdClean)) {
                targetElement = heading;
                break;
              }
            }
          }
        }
        
        console.log('Found element:', targetElement); // Debug log
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.warn('Element not found for ID:', targetId);
        }
      }
    };

    // Add event listener for TOC clicks - use capture to ensure it runs
    document.addEventListener('click', handleTOCClick, true);
    
    return () => {
      document.removeEventListener('click', handleTOCClick, true);
    };
  }, [content]); // Add content as dependency

  const processedContent = processContent(content);

  // Custom components cho markdown với font tiếng Việt và image styling
  const components = {
    // Custom heading component để tạo ID cho smooth scrolling
    h1: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      console.log('H1 ID created:', id, 'from:', children); // Debug log
      return (
        <h1 id={id} className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8 first:mt-0" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      console.log('H2 ID created:', id, 'from:', children); // Debug log
      return (
        <h2 id={id} className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      console.log('H3 ID created:', id, 'from:', children); // Debug log
      return (
        <h3 id={id} className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-4 first:mt-0" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      return (
        <h4 id={id} className="text-lg font-bold text-gray-900 dark:text-white mb-2 mt-4 first:mt-0" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      return (
        <h5 id={id} className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }) => {
      const createId = (text) => {
        return String(text)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      };
      const id = children ? createId(children) : '';
      return (
        <h6 id={id} className="text-sm font-bold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0" {...props}>
          {children}
        </h6>
      );
    },
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
    img: ({ node, alt, src, title, ...props }) => {
      return (
        <div className="my-6 flex justify-center">
          <div className="max-w-full overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <img
              src={src}
              alt={alt || ''}
              title={title}
              className="w-full h-auto max-w-4xl object-contain transition-transform duration-300 hover:scale-105"
              style={{
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
              loading="lazy"
              {...props}
            />
            {alt && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{alt}</p>
              </div>
            )}
          </div>
        </div>
      );
    },
    // Style links - đảm bảo "Read More" mở tab mới và TOC links scroll smooth
    a: ({ node, href, children, ...props }) => {
      // Check if it's a "Read More" link (case insensitive)
      const isReadMore = children && 
        (children[0] === 'Read more' || 
         children[0] === 'Read More' || 
         children[0] === 'read more' ||
         String(children[0]).toLowerCase().trim() === 'read more');
      
      // Check if it's an external link
      const isExternal = href?.startsWith('http');
      
      // Check if it's a TOC link (internal anchor)
      const isTOCLink = href?.startsWith('#');
      
      return (
        <a 
          href={href} 
          className={`${
            isTOCLink 
              ? "text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer" 
              : "text-indigo-600 hover:text-indigo-800 hover:underline"
          }`}
          {...(isReadMore || isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
          {(isReadMore || isExternal) && (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3.5 w-3.5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          )}
        </a>
      );
    },
  };

  return (
    <div 
      className="prose prose-vietnamese dark:prose-invert max-w-none prose-lg prose-blue"
      onClick={(e) => {
        // Handle TOC clicks directly on the container
        const target = e.target;
        if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const targetId = target.getAttribute('href').substring(1);
          console.log('Container TOC Click - Target ID:', targetId);
          
          // Try to find element by ID
          let targetElement = document.getElementById(targetId);
          
          // If not found, try to find by partial match or similar ID
          if (!targetElement) {
            const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            for (let heading of allHeadings) {
              if (heading.id) {
                // Try exact match first
                if (heading.id === targetId) {
                  targetElement = heading;
                  break;
                }
                // Try partial match (remove all dashes and compare)
                const headingIdClean = heading.id.replace(/-/g, '');
                const targetIdClean = targetId.replace(/-/g, '');
                if (headingIdClean === targetIdClean || headingIdClean.includes(targetIdClean)) {
                  targetElement = heading;
                  break;
                }
              }
            }
          }
          
          console.log('Container Found element:', targetElement);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } else {
            console.warn('Container Element not found for ID:', targetId);
          }
        }
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
