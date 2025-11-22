// src/pages/HomePage.jsx (enhanced version)
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import HuggingFaceHubSection from '../components/HuggingFaceHubSection';
import OpenRouterModelsSection from '../components/OpenRouterModelsSection';
import DailyPapersSection from '../components/DailyPapersSection';
import GitHubTrendingSection from '../components/GitHubTrendingSection';
import { fetchLatestReport } from '../services/api';

const HomePage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);


  useEffect(() => {
    const loadLatestReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestReport();
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to load latest report');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial data fetch kept for compatibility (can be removed later if not used)
    loadLatestReport();

    // Animation delay
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleMotionChange();
    mediaQuery.addEventListener?.('change', handleMotionChange);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-6">
        <LoadingSpinner />
        <div className="text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 rounded-lg w-48 mb-2 mx-auto bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-4 rounded-lg w-32 mx-auto bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!report) {
    return <ErrorMessage message="Latest report not found" />;
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 ${prefersReducedMotion ? '' : 'transition-all duration-700 transform'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Enhanced Hero Section */}
      <div className="mb-10 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className={`absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'animate-float-gentle'}`}
               style={{ background: 'var(--gradient-primary)' }}></div>
          <div className={`absolute top-20 right-1/4 w-48 h-48 rounded-full opacity-15 dark:opacity-5 ${prefersReducedMotion ? '' : 'animate-float-gentle'}`}
               style={{ background: 'var(--gradient-secondary)', animationDelay: '-2s' }}></div>
        </div>

        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Tech Digest Vietnam
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 text-secondary">
            📊 Cập nhật <span className="font-semibold text-primary-600 dark:text-dark-accent-primary-bg">xu hướng công nghệ</span> mới nhất từ hệ sinh thái công nghệ Việt Nam
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-primary-50 dark:bg-dark-bg-tertiary border border-primary-200 dark:border-dark-border-secondary">
              <svg className="w-5 h-5 text-primary-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-primary-700 dark:text-dark-text-primary">
                Cập nhật hàng ngày
              </span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-accent-emerald-light/10 dark:bg-dark-accent-emerald/10 border border-accent-emerald-light/30 dark:border-dark-accent-emerald/30">
              <svg className="w-5 h-5 text-accent-emerald dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-accent-emerald-dark dark:text-dark-accent-emerald">
                Đáng tin cậy
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* HF Trending Layout */}
      <div className="space-y-8 mb-14">
        <HuggingFaceHubSection />
        <OpenRouterModelsSection />
        <GitHubTrendingSection />
      </div>

      {/* Daily Papers Section at the bottom */}
      <div className="mb-14">
        <DailyPapersSection />
      </div>

        {/* NOTE: Removed legacy "Khám phá thêm" quick-links grid here to avoid JSX duplication issues */}

      {/* Features Section - New */}
      <div className="bg-neutral-50 dark:bg-[#020817] rounded-3xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Tại sao chọn Tech Digest Vietnam?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-dark-accent-primary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Đáng tin cậy</h3>
            <p className="text-secondary text-sm">Thông tin được kiểm chứng và cập nhật chính xác</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-dark-accent-emerald/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Cập nhật thường xuyên</h3>
            <p className="text-secondary text-sm">Thông tin mới được cập nhật hàng ngày</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-dark-accent-secondary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-dark-accent-secondary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Dễ đọc</h3>
            <p className="text-secondary text-sm">Giao diện thân thiện và dễ sử dụng</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-dark-accent-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-dark-accent-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Chuyên sâu</h3>
            <p className="text-secondary text-sm">Phân tích chi tiết về công nghệ Việt Nam</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
