// src/utils/markdownProcessor.js
export const processMarkdownContent = (markdownContent) => {
  if (!markdownContent) return { title: 'Tech Digest', sections: [], tocItems: [] };

  // Clean up any existing HTML ID tags in the markdown content
  const cleanedContent = markdownContent
    .replace(/<a\s+id="([^"]+)"><\/a>/g, '')
    .replace(/<a\s+id="([^"]+)">(.+?)<\/a>/g, '$2')
    .replace(/(.+?)<a id="(.+?)"><\/a>/g, '$1');

  // Extract title from the first line (assuming it's an h1)
  const titleMatch = cleanedContent.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Tech Digest Vietnam';

  // Extract date if present (common format in tech digests)
  const dateMatch = title.match(/.* - (.+?)$/);
  const date = dateMatch ? dateMatch[1] : null;

  // Extract headings for TOC
  const headingRegex = /^(#{1,3}) (.+?)$/gm;
  const tocItems = [];
  let match;
  let counter = 1;
  
  while ((match = headingRegex.exec(cleanedContent)) !== null) {
    // Skip h1 as it's usually the title
    if (match[1] === '#') continue;
    
    const level = match[1].length; // Number of # symbols
    const title = match[2].trim();
    
    // Generate an ID for the heading
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Extract subtitle if exists (common in tech digests)
    const subtitleMatch = title.match(/^(.+?): (.+)$/);
    
    tocItems.push({
      id,
      level,
      number: level === 2 ? counter++ : null,
      title: subtitleMatch ? subtitleMatch[1] : title,
      subtitle: subtitleMatch ? subtitleMatch[2] : null
    });
  }

  // Extract sections (everything between ## headings)
  const sectionRegex = /^## (.+?)(?:\n|$)([\s\S]*?)(?=^## |\n$|$)/gm;
  const sections = [];
  let sectionMatch;
  let index = 0;
  
  while ((sectionMatch = sectionRegex.exec(cleanedContent)) !== null) {
    const sectionTitle = sectionMatch[1].trim();
    const sectionContent = sectionMatch[2].trim();
    
    // Check if this is a Table of Contents section
    const isToc = sectionTitle.toLowerCase().includes('table of contents');
    
    // Generate an ID for the section
    const sectionId = sectionTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // For numbered sections, try to extract the number and title
    const numberMatch = sectionTitle.match(/^(\d+)\.\s+(.+)$/);
    
    sections.push({
      id: sectionId,
      title: sectionTitle,
      content: sectionContent,
      isToc,
      number: numberMatch ? numberMatch[1] : index + 1,
      plainTitle: numberMatch ? numberMatch[2] : sectionTitle
    });
    
    index++;
  }

  return { title, date, sections, tocItems };
};

// Helper function to process individual sections for better display
export const processSection = (section) => {
  if (!section || !section.content) return section;
  
  let processedContent = section.content;
  
  // Clean up any HTML ID tags
  processedContent = processedContent
    .replace(/<a\s+id="([^"]+)"><\/a>/g, '')
    .replace(/<a\s+id="([^"]+)">(.+?)<\/a>/g, '$2')
    .replace(/(.+?)<a id="(.+?)"><\/a>/g, '$1');
  
  // Process source references
  processedContent = processedContent.replace(
    /^\*Source:.*?\*$/gm,
    (match) => `<div class="source-reference">${match}</div>`
  );
  
  // Process subsections (### headings)
  processedContent = processedContent.replace(
    /^### (.+?)$/gm,
    (match, title) => `<h3 class="subsection-title">${title}</h3>`
  );
  
  // Process "Read more" links
  processedContent = processedContent.replace(
    /\[Read more\]\((.*?)\)/g,
    '<a href="$1" class="read-more-link">Read more</a>'
  );
  
  return { ...section, processedContent };
};
