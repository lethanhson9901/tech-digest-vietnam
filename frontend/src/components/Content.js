// src/components/Content.js
import React from 'react';

function Content({ title, sections }) {
  return (
    <div className="content">
      <article id="markdown-content">
        <h1>{title}</h1>
        
        {sections.map((section, index) => (
          <div className="section-container" key={index}>
            <div className="article-title">
              <h2 
                id={section.id} 
                data-original-id={section.originalId}
              >
                {section.title}
              </h2>
              {section.description && <span>{section.description}</span>}
            </div>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}
        
        {sections.length === 0 && (
          <div className="loading-message">
            <p>Loading content...</p>
          </div>
        )}
      </article>
    </div>
  );
}

export default Content;
