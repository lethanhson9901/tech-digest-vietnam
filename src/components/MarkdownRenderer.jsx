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

  // Rút gọn overrides: để typography/prose xử lý, chỉ thêm copy cho code block
  const components = {
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return <code {...props}>{children}</code>;
      }
      const codeText = String(children).replace(/\n$/, '');
      const langMatch = /language-(\w+)/.exec(className || '');
      const language = langMatch ? langMatch[1] : 'text';
      const handleCopy = () => {
        if (navigator?.clipboard?.writeText) {
          navigator.clipboard.writeText(codeText).catch(() => {});
        }
      };
      return (
        <div className="relative group my-4">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded bg-neutral-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Sao chép mã"
          >
            Copy
          </button>
          <pre className="bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-x-auto p-4">
            <code className={`font-mono text-sm language-${language}`}>{codeText}</code>
          </pre>
        </div>
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
