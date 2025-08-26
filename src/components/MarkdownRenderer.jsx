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

  // Pre-process content to remove visible HTML ID tags and backticks
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

  // Sử dụng inline formatting đơn giản cho tất cả code elements với font tiếng Việt
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
  };

  return (
    <div className="prose prose-vietnamese dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
