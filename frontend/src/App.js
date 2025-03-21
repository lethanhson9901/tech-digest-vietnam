// src/App.js
import React, { useEffect, useState } from 'react';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import './styles/theme.css';
import { parseMarkdown } from './utils/markdownParser';

function App() {
  const [title, setTitle] = useState('Tech Digest Vietnam');
  const [tocItems, setTocItems] = useState([]);
  const [contentSections, setContentSections] = useState([]);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the markdown file
    setIsLoading(true);
    fetch('tech_news_digest_20250319.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load markdown file');
        }
        return response.text();
      })
      .then(text => {
        const { title: parsedTitle, tocItems, contentSections } = parseMarkdown(text);
        setTitle(parsedTitle);
        setTocItems(tocItems);
        setContentSections(contentSections);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading markdown:', error);
        setIsLoading(false);
      });
  }, []);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle initial URL hash for scrolling to section
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash && contentSections.length > 0) {
        const originalId = hash.substring(1);
        
        // Wait for DOM to be fully rendered
        setTimeout(() => {
          const targetElement = document.querySelector(`[data-original-id="${originalId}"]`);
          
          if (targetElement) {
            const sectionContainer = targetElement.closest('.section-container');
            window.scrollTo({
              top: sectionContainer.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    };
    
    if (!isLoading) {
      handleInitialHash();
    }
  }, [contentSections, isLoading]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <Header>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </Header>
      <main>
        <Sidebar tocItems={tocItems} />
        <Content 
          title={title} 
          sections={contentSections} 
          isLoading={isLoading} 
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
