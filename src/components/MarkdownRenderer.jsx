// src/components/MarkdownRenderer.jsx
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarkdownRenderer = ({ content, autoTOC = false }) => {
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

  // Generate table of contents from h2 headings
  const generateTOC = (content) => {
    if (!content) return '';
    
    const lines = content.split('\n');
    const h2Headings = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('###')) {
        const headingText = trimmedLine.replace('## ', '').trim();
        if (headingText) {
          const id = headingText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
          h2Headings.push({ text: headingText, id });
        }
      }
    });
    
    if (h2Headings.length === 0) return '';
    
    let toc = '## Mục lục\n\n';
    h2Headings.forEach((heading, index) => {
      toc += `${index + 1}. [${heading.text}](#${heading.id})\n`;
    });
    toc += '\n---\n\n';
    
    return toc;
  };

  // Check if content already has a table of contents
  const hasTOC = (content) => {
    if (!content) return false;
    const lines = content.split('\n');
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line === '## Mục lục' || line.toLowerCase().includes('mục lục') || line.toLowerCase().includes('table of contents')) {
        return true;
      }
    }
    return false;
  };

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
    
    // Add table of contents if autoTOC is enabled and not already present
    if (autoTOC && !hasTOC(processedContent)) {
      const toc = generateTOC(processedContent);
      if (toc) {
        processedContent = toc + processedContent;
      }
    }
    
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
