// src/utils/markdownParser.js
export function parseMarkdown(markdown) {
  // Extract the title and table of contents section
  const titleMatch = markdown.match(/# (.*?)(\r?\n|$)/);
  const title = titleMatch ? titleMatch[1] : "Tech Digest Vietnam";
  
  // Extract TOC items from the Table of Contents section
  const tocSection = markdown.match(/## Table of Contents\s+([\s\S]*?)(?=\n---|\n##)/);
  const tocContent = tocSection ? tocSection[1] : '';
  
  // Parse the TOC items using a regex that matches your specific format
  const tocRegex = /(\d+)\. \[(.*?)\]\((.*?)\)(?::\s+(.*?))?(?:\r?\n|$)/g;
  const tocMatches = [...tocContent.matchAll(tocRegex)];
  
  const tocItems = tocMatches.map(match => ({
    num: match[1],
    title: match[2],
    link: match[3],
    description: match[4] || ''
  }));
  
  // Extract content sections
  const sectionRegex = /## (\d+)\. (.*?)<a id="(.*?)"><\/a>(?:\s*\*(.*?)\*)?(?:\s*\*Source:.*?\*)?(?:\s*###[\s\S]*?)(?=\n## \d+\.|\n---|\s*$)/g;
  const sectionMatches = [...markdown.matchAll(sectionRegex)];
  
  const contentSections = sectionMatches.map(match => {
    const num = match[1];
    const title = match[2].trim();
    const id = match[3];
    const description = match[4] || '';
    
    // Extract the content after the section header
    let sectionContent = match[0].slice(match[0].indexOf('###'));
    
    // Tạo một CSS-safe ID bằng cách thêm tiền tố 'section-'
    const safeId = `section-${id}`;
    
    return {
      num,
      title,
      link: `#${id}`, // Giữ nguyên link cho URL
      id: safeId,     // ID an toàn cho CSS
      originalId: id, // Lưu ID gốc nếu cần
      description,
      content: processContent(sectionContent)
    };
  });
  
  return { title, tocItems, contentSections };
}

function processContent(content) {
  // Process headers
  content = content.replace(/### (.*?)(\r?\n|$)/g, '<h3>$1</h3>');
  content = content.replace(/#### (.*?)(\r?\n|$)/g, '<h4>$1</h4>');
  
  // Process source information in italics
  content = content.replace(/\*Source: (.*?)\*(\r?\n|$)/g, '<p class="source"><em>Source: $1</em></p>');
  
  // Process bold text
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Process links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Process remaining paragraphs
  const paragraphs = content.split(/\r?\n\r?\n/);
  let processedContent = '';
  
  paragraphs.forEach(para => {
    if (!para.trim()) return;
    if (!para.startsWith('<h') && !para.startsWith('<p class="source">')) {
      // Remove leading and trailing asterisks for italic text
      const cleanPara = para.replace(/^\*(.*)\*$/, '$1');
      processedContent += `<p>${cleanPara}</p>`;
    } else {
      processedContent += para;
    }
  });
  
  return processedContent;
}
