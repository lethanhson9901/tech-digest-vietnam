// src/components/LatestReport.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Content from './Content';
import Sidebar from './Sidebar';

function LatestReport() {
  const [report, setReport] = useState(null);
  const [sections, setSections] = useState([]);
  const [tocItems, setTocItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the latest report from the API
        const response = await axios.get('https://tech-digest-vietnam.vercel.app/reports/latest');
        setReport(response.data);
        
        // Process the markdown content to extract sections and TOC
        if (response.data && response.data.content) {
          processMarkdownContent(response.data.content);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching latest report:', err);
        setError('Failed to load the latest report. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchLatestReport();
  }, []);

  const processMarkdownContent = (markdownContent) => {
    // Extract title from the first line (assuming it's an h1)
    const titleMatch = markdownContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Tech Digest Vietnam';
    
    // Extract TOC and sections
    const sectionRegex = /^## (.+?)(?:\n|$)([\s\S]*?)(?=^## |\n$|$)/gm;
    let match;
    const extractedSections = [];
    const extractedTocItems = [];
    
    let index = 0;
    while ((match = sectionRegex.exec(markdownContent)) !== null) {
      const sectionTitle = match[1].trim();
      const sectionContent = match[2].trim();
      
      // Generate a clean ID for the section
      const originalId = sectionTitle.toLowerCase().replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const sectionId = `section-${index}`;
      
      // Convert markdown to HTML (simplified version)
      // In a real app, you'd use a proper markdown parser
      const htmlContent = convertMarkdownToHtml(sectionContent);
      
      extractedSections.push({
        id: sectionId,
        originalId,
        title: sectionTitle,
        content: htmlContent
      });
      
      extractedTocItems.push({
        title: sectionTitle,
        link: `#${originalId}`
      });
      
      index++;
    }
    
    setSections(extractedSections);
    setTocItems(extractedTocItems);
  };

  // Simplified markdown to HTML converter
  // In a real application, use a proper markdown library
  const convertMarkdownToHtml = (markdown) => {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/# (.*?)$/gm, '<h1>$1</h1>');
    
    // Convert paragraphs
    html = html.replace(/(?:^|\n)(?!<h|<ul|<ol|<li|<p|<blockquote)(.+)/gm, '<p>$1</p>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Convert bold and italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    return html;
  };

  if (isLoading) {
    return (
      <div className="content">
        <div className="loading-message">
          <p>Loading the latest tech digest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Extract title from the first line of the content (assuming it's an h1)
  const titleMatch = report?.content?.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Tech Digest Vietnam';

  return (
    <div className="main-container">
      <Sidebar tocItems={tocItems} />
      <Content title={title} sections={sections} />
    </div>
  );
}

export default LatestReport;
