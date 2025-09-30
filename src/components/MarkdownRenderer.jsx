// src/components/MarkdownRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarkdownRenderer = ({ content }) => {

  // Pre-process content to remove visible HTML ID tags, backticks, and replace &nbsp; with newlines
  const processContent = (content) => {
    if (!content) return '';
    
    let processedContent = content
      // Convert literal "\n" sequences to real newlines
      .replace(/\\n/g, '\n')
      // Replace &nbsp; with newline
      .replace(/&nbsp;/g, '\n')
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

  const processedContent = processContent(content);

  // Custom components cho markdown với font tiếng Việt và image styling
  const components = {
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
    // Style links - đảm bảo "Read More" mở tab mới
    a: ({ node, href, children, ...props }) => {
      // Check if it's a "Read More" link (case insensitive)
      const isReadMore = children && 
        (children[0] === 'Read more' || 
         children[0] === 'Read More' || 
         children[0] === 'read more' ||
         String(children[0]).toLowerCase().trim() === 'read more');
      
      // Check if it's an external link
      const isExternal = href?.startsWith('http');
      
      return (
        <a 
          href={href} 
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
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
    <div className="prose prose-vietnamese dark:prose-invert max-w-none prose-lg prose-blue">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
