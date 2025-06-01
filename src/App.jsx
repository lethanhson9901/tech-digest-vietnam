// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import ArchivePage from './pages/ArchivePage';
import CombinedAnalysisPage from './pages/CombinedAnalysisPage';
import CombinedAnalysisDetailPage from './pages/CombinedAnalysisDetailPage';
import HomePage from './pages/HomePage';
import LatestReportPage from './pages/LatestReportPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportDetailPage from './pages/ReportDetailPage';
import BackToTop from './components/BackToTop';

// Enhanced UX Components
import { ToastProvider } from './components/ToastNotification';
import { FocusProvider, SkipToMain, KeyboardShortcut } from './components/FocusManager';
import { PerformanceProvider } from './components/PerformanceMonitor';
import LoadingSpinner from './components/LoadingSpinner';

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
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark');
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
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--bg-gradient-light)' }}
        role="status"
        aria-live="polite"
        aria-label="Đang tải ứng dụng"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-float-gentle"
               style={{ background: 'var(--gradient-primary)' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-float-gentle"
               style={{ background: 'var(--gradient-secondary)', animationDelay: '-3s' }}></div>
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto px-6">
          <div className="relative mb-8">
            {/* Main logo with enhanced accessibility */}
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-bounce-soft relative focus:outline-none focus:ring-4 focus:ring-offset-4"
              style={{ 
                background: 'var(--gradient-primary)',
                focusRingColor: 'var(--color-primary-300)'
              }}
              tabIndex="0"
              role="img"
              aria-label="Logo Tech Digest Vietnam"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl animate-glow-pulse opacity-60"
                 style={{ background: 'var(--gradient-primary)' }} aria-hidden="true" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3 animate-fadeIn"
              style={{ color: 'var(--color-primary-700)' }}>
            Tech Digest Vietnam
          </h1>
          <p className="text-lg mb-6 animate-fadeIn"
             style={{ color: 'var(--color-neutral-600)' }}>
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
    <PerformanceProvider enableDevMode={process.env.NODE_ENV === 'development'}>
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
                className="fixed top-0 left-0 right-0 z-50 p-3 text-center font-medium"
                style={{
                  background: 'var(--color-accent-orange)',
                  color: 'white'
                }}
                role="alert"
                aria-live="assertive"
              >
                📶 Bạn đang offline. Một số tính năng có thể không hoạt động.
              </div>
            )}

            <div 
              className="min-h-screen transition-colors duration-500" 
              style={{ background: isDarkMode ? 'var(--bg-gradient-dark)' : 'var(--bg-gradient-light)' }}
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
                  <Route path="/combined-analysis/:id" element={<CombinedAnalysisDetailPage />} />
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

                    {/* Enhanced social links with better accessibility */}
                    <div 
                      className="flex items-center space-x-5"
                      role="navigation"
                      aria-label="Liên kết mạng xã hội"
                    >
                      {[
                        { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                        { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                        { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
                      ].map((social, index) => (
                        <a 
                          key={social.name}
                          href="#" 
                          className="p-2 rounded-lg transition-all duration-200 hover:transform hover:translateY(-1px) hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{
                            color: isDarkMode ? 'var(--color-neutral-500)' : 'var(--color-neutral-400)',
                            background: isDarkMode ? 'var(--color-neutral-800)' : 'var(--color-neutral-100)',
                            focusRingColor: 'var(--color-primary-500)'
                          }}
                          aria-label={`Theo dõi trên ${social.name}`}
                          onMouseEnter={(e) => {
                            e.target.style.color = 'var(--color-primary-500)';
                            e.target.style.background = isDarkMode ? 'var(--color-neutral-700)' : 'var(--color-primary-50)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = isDarkMode ? 'var(--color-neutral-500)' : 'var(--color-neutral-400)';
                            e.target.style.background = isDarkMode ? 'var(--color-neutral-800)' : 'var(--color-neutral-100)';
                          }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d={social.path} />
                          </svg>
                        </a>
                      ))}
                    </div>
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
    </PerformanceProvider>
  );
};

export default App;
