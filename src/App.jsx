// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import ArchivePage from './pages/ArchivePage';
import HomePage from './pages/HomePage';
import LatestReportPage from './pages/LatestReportPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportDetailPage from './pages/ReportDetailPage';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dark-theme') === 'true';
    setDarkMode(savedTheme);
    if (savedTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('dark-theme', newMode);
      document.body.classList.toggle('dark-theme', newMode);
      return newMode;
    });
  };

  // Get basename from package.json homepage or default to empty string
  const getBasename = () => {
    // For GitHub Pages: extract path from homepage in package.json
    if (process.env.PUBLIC_URL) {
      return process.env.PUBLIC_URL;
    }
    return '/tech-digest-vietnam';
  };

  return (
    <Router basename={getBasename()}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reports/:id" element={<ReportDetailPage />} />
            <Route path="/latest" element={<LatestReportPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Tech Digest. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-1">Powered by Tech Digest API</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
