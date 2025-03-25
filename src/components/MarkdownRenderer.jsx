// src/components/MarkdownRenderer.jsx
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  useEffect(() => {
    // Add IDs to headings for TOC navigation after rendering
    const headings = document.querySelectorAll('.prose h2, .prose h3, .prose h4');
    headings.forEach(heading => {
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    });
  }, [content]);

  // Pre-process content to remove visible HTML ID tags
  const processContent = (content) => {
    if (!content) return '';
    
    // Remove the visible ID attributes from headings
    return content
      // Replace patterns like <a id="something"></a> with empty string
      .replace(/<a\s+id="([^"]+)"><\/a>/g, '')
      // Replace patterns like <a id="something">text</a> with just text
      .replace(/<a\s+id="([^"]+)">(.+?)<\/a>/g, '$2')
      // Clean up heading IDs that appear in the rendered text
      .replace(/(.+?)<a id="(.+?)"><\/a>/g, '$1')
      // Remove any remaining id="something" from the text
      .replace(/<a id="([^"]+)">/g, '')
      .replace(/<\/a>/g, '');
  };

  const processedContent = processContent(content);

  // Custom components for better rendering
  const components = {
    // Improve heading styles with auto-ID generation
    h1: ({ node, ...props }) => {
      const id = props.children.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return (
        <h1 
          id={id} 
          className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200" 
          {...props} 
        />
      );
    },
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
          className="text-2xl font-bold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200" 
          {...props} 
        />
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
          className="text-xl font-semibold text-gray-800 mt-5 mb-2" 
          {...props} 
        />
      );
    },
    h4: ({ node, ...props }) => {
      const id = props.children.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return (
        <h4 
          id={id} 
          className="text-lg font-semibold text-gray-700 mt-4 mb-2" 
          {...props} 
        />
      );
    },
    // Style links
    a: ({ node, ...props }) => (
      <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />
    ),
    // Style list items
    li: ({ node, ordered, ...props }) => (
      <li className="my-1 ml-4" {...props} />
    ),
    // Style blockquotes
    blockquote: ({ node, ...props }) => (
      <blockquote className="pl-4 border-l-4 border-indigo-300 italic text-gray-700 my-4" {...props} />
    ),
    // Skip code blocks if they're not needed
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <span className="bg-gray-100 text-indigo-700 px-1 py-0.5 rounded font-mono text-sm" {...props}>
            {children}
          </span>
        );
      }
      // Return empty if code blocks aren't needed
      return null;
    },
    // Style emphasis and strong
    em: ({ node, ...props }) => (
      <em className="italic text-gray-600" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-bold" {...props} />
    ),
  };

  return (
    <div className="prose prose-indigo max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
