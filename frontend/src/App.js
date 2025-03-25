// src/App.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Archive from './components/Archive';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the latest report from API
    const fetchLatestReport = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://tech-digest-vietnam.vercel.app/reports/latest');
        
        if (response.data && response.data.content) {
          // Parse the markdown content using your existing parseMarkdown utility
          const { title: parsedTitle, tocItems, contentSections } = parseMarkdown(response.data.content);
          setTitle(parsedTitle);
          setTocItems(tocItems);
          setContentSections(contentSections);
        } else {
          throw new Error('Invalid response format');
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

  // Render error message if there's an error
  const renderContent = () => {
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
    
    return (
      <>
        <Sidebar tocItems={tocItems} />
        <Content 
          title={title} 
          sections={contentSections} 
          isLoading={isLoading} 
        />
      </>
    );
  };

  return (
    <Router>
      <div className="app">
        <Header>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </Header>
        <main>
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
