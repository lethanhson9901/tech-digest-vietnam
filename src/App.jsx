// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import FontDemo from './components/FontDemo';
import Header from './components/Header';
import ArchivePage from './pages/ArchivePage';
import CombinedAnalysisDetailPage from './pages/CombinedAnalysisDetailPage';
import CombinedAnalysisPage from './pages/CombinedAnalysisPage';
import HomePage from './pages/HomePage';
import LatestCombinedAnalysisPage from './pages/LatestCombinedAnalysisPage';
import LatestHackerNewsReportPage from './pages/LatestHackerNewsReportPage';
import LatestRedditReportPage from './pages/LatestRedditReportPage';
import LatestReportPage from './pages/LatestReportPage';
import NotFoundPage from './pages/NotFoundPage';
import HackerNewsReportDetailPage from './pages/HackerNewsReportDetailPage';
import HackerNewsReportsArchivePage from './pages/HackerNewsReportsArchivePage';
import LatestProductHuntReportPage from './pages/LatestProductHuntReportPage';
import ProductHuntReportDetailPage from './pages/ProductHuntReportDetailPage';
import ProductHuntReportsArchivePage from './pages/ProductHuntReportsArchivePage';
import RedditReportDetailPage from './pages/RedditReportDetailPage';
import RedditReportsArchivePage from './pages/RedditReportsArchivePage';
import ReportDetailPage from './pages/ReportDetailPage';

// Enhanced UX Components
import { FocusProvider, KeyboardShortcut, SkipToMain } from './components/FocusManager';
import LoadingSpinner from './components/LoadingSpinner';
import SocialLinks from './components/SocialLinks';
import { ToastProvider } from './components/ToastNotification';

import './App.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // App initialization with progressive loading
    const initializeApp = async () => {
      try {
        // Simulate critical resource loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check for saved preferences
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          // Apply saved preferences
          console.log('Loading user preferences...');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Dark mode persistence and system preference detection
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = isDarkMode ? '#0f172a' : '#f8fafc';
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Get basename from package.json homepage or default to empty string
  const getBasename = () => {
    if (process.env.PUBLIC_URL) {
      return process.env.PUBLIC_URL;
    }
    return '/tech-digest-vietnam';
  };

  // Enhanced loading screen with better accessibility
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-app-light"
        role="status"
        aria-live="polite"
        aria-label="Đang tải ứng dụng"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-float-gentle bg-gradient-primary"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-float-gentle bg-gradient-secondary" style={{ animationDelay: '-3s' }}></div>
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto px-6">
          <div className="relative mb-8">
            {/* Main logo with enhanced accessibility */}
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-bounce-soft relative focus:outline-none focus:ring-4 focus:ring-offset-4 bg-gradient-primary"
              tabIndex="0"
              role="img"
              aria-label="Logo Tech Digest Vietnam"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl animate-glow-pulse opacity-60 bg-gradient-primary" aria-hidden="true" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3 animate-fadeIn text-primary">
            Tech Digest Vietnam
          </h1>
          <p className="text-lg mb-6 animate-fadeIn text-secondary">
            Đang khởi tạo ứng dụng...
          </p>
          
          <LoadingSpinner 
            variant="tech"
            size="large"
            showProgress={true}
            showText={false}
          />
        </div>
      </div>
    );
  }

  return (
      <FocusProvider>
        <ToastProvider>
          <Router basename={getBasename()}>
            {/* Skip to main content for accessibility */}
            <SkipToMain />
            
            {/* Keyboard shortcuts */}
            <KeyboardShortcut 
              keys="ctrl+d" 
              onActivate={toggleDarkMode}
              description="Toggle dark mode"
            />

            {/* Offline indicator */}
            {!isOnline && (
              <div 
                className="fixed top-0 left-0 right-0 z-50 p-3 text-center font-medium bg-accent-orange text-white"
                role="alert"
                aria-live="assertive"
              >
                📶 Bạn đang offline. Một số tính năng có thể không hoạt động.
              </div>
            )}

            <div 
              className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-app-dark' : 'bg-gradient-app-light'}`}
            >
              <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              
              <main 
                id="main-content"
                className="container mx-auto px-4 py-8"
                role="main"
                tabIndex="-1"
                style={{ paddingTop: isOnline ? '2rem' : '5rem' }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/reports/:id" element={<ReportDetailPage />} />
                  <Route path="/latest" element={<LatestReportPage />} />
                  <Route path="/archive" element={<ArchivePage />} />
                  <Route path="/combined-analysis" element={<CombinedAnalysisPage />} />
                  <Route path="/combined-analysis/latest" element={<LatestCombinedAnalysisPage />} />
                  <Route path="/combined-analysis/:id" element={<CombinedAnalysisDetailPage />} />
                  <Route path="/font-demo" element={<FontDemo />} />
                  <Route path="/reddit-reports" element={<LatestRedditReportPage />} />
                  <Route path="/reddit-reports/:id" element={<RedditReportDetailPage />} />
                  <Route path="/reddit-reports-archive" element={<RedditReportsArchivePage />} />
                  <Route path="/hackernews-reports" element={<LatestHackerNewsReportPage />} />
                  <Route path="/hackernews-reports/:id" element={<HackerNewsReportDetailPage />} />
                  <Route path="/hackernews-reports-archive" element={<HackerNewsReportsArchivePage />} />
                  <Route path="/product-hunt-reports" element={<LatestProductHuntReportPage />} />
                  <Route path="/product-hunt-reports/:id" element={<ProductHuntReportDetailPage />} />
                  <Route path="/product-hunt-reports-archive" element={<ProductHuntReportsArchivePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
              {/* Enhanced footer with better accessibility */}
              <footer 
                className="relative mt-16 backdrop-blur-lg"
                style={{ 
                  background: isDarkMode 
                    ? 'rgba(15, 23, 42, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  borderTop: `1px solid ${isDarkMode ? 'var(--color-neutral-700)' : 'var(--color-neutral-200)'}`
                }}
                role="contentinfo"
                aria-label="Thông tin chân trang"
              >
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    {/* Enhanced brand section with better focus management */}
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2"
                        style={{ 
                          background: 'var(--gradient-primary)',
                          focusRingColor: 'var(--color-primary-300)'
                        }}
                        tabIndex="0"
                        role="img"
                        aria-label="Logo Tech Digest Vietnam"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg"
                            style={{ color: isDarkMode ? 'var(--color-neutral-100)' : 'var(--color-neutral-900)' }}>
                          Tech Digest Vietnam
                        </h3>
                        <p className="text-sm"
                           style={{ color: isDarkMode ? 'var(--color-neutral-400)' : 'var(--color-neutral-600)' }}>
                          Cập nhật công nghệ hàng ngày 🚀
                        </p>
                      </div>
                    </div>

                    {/* Navigation links with better accessibility */}
                    <nav 
                      className="flex items-center space-x-8"
                      role="navigation"
                      aria-label="Liên kết chân trang"
                    >
                      {['Về chúng tôi', 'Liên hệ', 'Chính sách'].map((item, index) => (
                        <a 
                          key={index}
                          href={`/${item.toLowerCase().replace(/\s+/g, '')}`}
                          className="font-medium transition-all duration-200 hover:transform hover:translateY(-1px) focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg px-2 py-1"
                          style={{ 
                            color: isDarkMode ? 'var(--color-neutral-400)' : 'var(--color-neutral-600)',
                            focusRingColor: 'var(--color-primary-500)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = 'var(--color-primary-600)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = isDarkMode ? 'var(--color-neutral-400)' : 'var(--color-neutral-600)';
                          }}
                        >
                          {item}
                        </a>
                      ))}
                    </nav>

                    {/* Social links */}
                    <SocialLinks />
                  </div>

                  {/* Copyright section with better styling */}
                  <div className="mt-8 pt-6"
                       style={{ 
                         borderTop: `1px solid ${isDarkMode ? 'var(--color-neutral-700)' : 'var(--color-neutral-200)'}` 
                       }}>
                    <div className="text-center">
                      <p className="text-sm"
                         style={{ color: isDarkMode ? 'var(--color-neutral-500)' : 'var(--color-neutral-500)' }}>
                        © {new Date().getFullYear()} Tech Digest Vietnam. 
                        <span className="ml-2 inline-flex items-center">
                          Được phát triển với 
                          <span className="mx-1 text-red-500 animate-pulse" aria-label="yêu thương">❤️</span> 
                          từ Việt Nam
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </footer>

              {/* Back to Top Button */}
              <BackToTop />
            </div>
          </Router>
        </ToastProvider>
      </FocusProvider>
  );
};

export default App;
