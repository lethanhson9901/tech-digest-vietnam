// src/utils/markdownProcessor.js
export const processMarkdownContent = (markdownContent) => {
    if (!markdownContent) return { title: 'Tech Digest', sections: [], tocItems: [] };
    
    // Extract title from the first line (assuming it's an h1)
    const titleMatch = markdownContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Tech Digest Vietnam';
    
    // Extract date if present (common format in tech digests)
    const dateMatch = title.match(/.* - (.+?)$/);
    const date = dateMatch ? dateMatch[1] : null;
    
    // Extract table of contents items
    const tocRegex = /(\d+)\. \[(.*?)\](?:\(#(.*?)\))?: ?(.*?)(?=\n\d+\. \[|\n---|\n\n|$)/g;
    const tocItems = [];
    let tocMatch;
    
    while ((tocMatch = tocRegex.exec(markdownContent)) !== null) {
      tocItems.push({
        number: tocMatch[1],
        title: tocMatch[2],
        id: tocMatch[3] || tocMatch[2].toLowerCase().replace(/[^\w]+/g, '-'),
        subtitle: tocMatch[4]
      });
    }
    
    // Extract sections (everything between ## headings)
    const sectionRegex = /^## (.+?)(?:\n|$)([\s\S]*?)(?=^## |\n$|$)/gm;
    const sections = [];
    let sectionMatch;
    let index = 0;
    
    while ((sectionMatch = sectionRegex.exec(markdownContent)) !== null) {
      const sectionTitle = sectionMatch[1].trim();
      const sectionContent = sectionMatch[2].trim();
      
      // Check if this is a Table of Contents section
      const isToc = sectionTitle.toLowerCase().includes('table of contents');
      
      // Generate an ID for the section
      const sectionId = sectionTitle.toLowerCase().replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      
      // For numbered sections, try to extract the number and title
      const numberMatch = sectionTitle.match(/^(\d+)\.\s+(.+)$/);
      
      sections.push({
        id: sectionId,
        title: sectionTitle,
        content: sectionContent,
        isToc,
        number: numberMatch ? numberMatch[1] : null,
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
      '<a href="$1" class="read-more-link">Read more →</a>'
    );
    
    return {
      ...section,
      processedContent
    };
  };
  