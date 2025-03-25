// src/components/EnhancedContent.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EnhancedContent = ({ title, date, sections, tocItems }) => {
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
        {tocItems && tocItems.length > 0 && (
          <div className="bg-indigo-50 p-4 rounded-lg my-4 border border-indigo-100">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Table of Contents</h2>
            <ul className="space-y-2">
              {tocItems.map((item, index) => (
                <li key={index} className="flex">
                  <span className="text-indigo-600 font-medium mr-2">{item.number}.</span>
                  <a 
                    href={`#${item.id}`} 
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {item.title}
                    {item.subtitle && (
                      <span className="text-gray-600 ml-2 text-sm italic">
                        : {item.subtitle}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Sections */}
        {sections.map((section, index) => (
          <div 
            key={index} 
            id={section.id}
            className={`mt-8 ${section.isToc ? 'hidden' : ''}`}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {section.title}
            </h2>
            
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
            
            {index < sections.length - 1 && !sections[index + 1].isToc && (
              <hr className="my-8 border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedContent;
