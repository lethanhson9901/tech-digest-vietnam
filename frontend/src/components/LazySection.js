// Create a new file src/components/LazySection.js
import React from 'react';

function LazySection({ section }) {
  return (
    <div className="section-container">
      <div className="article-title">
        <h2 id={section.id}>{section.title}</h2>
        {section.description && <span>{section.description}</span>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: section.content }} />
    </div>
  );
}

export default LazySection;
