import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';

const WeeklyTechReportView = ({ report, isLoading, error, contentType = 'weekly-tech-reports' }) => {
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, dd MMMM yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getIssueNumber = (filename) => {
    const match = filename?.match(/issue-(\d+)/i);
    return match ? match[1] : null;
  };

  // Get content type display name
  const getContentTypeName = (type) => {
    const names = {
      'weekly-tech-reports': 'Tạp chí Công nghệ hằng tuần',
      'ai-news': 'AI News',
      'combined-analysis': 'Phân tích tổng hợp',
      'reddit-reports': 'Reddit Reports',
      'hackernews-reports': 'Hacker News Reports',
      'product-hunt-reports': 'Product Hunt Reports'
    };
    return names[type] || 'Báo cáo';
  };

  // Get archive path based on content type
  const getArchivePath = (type) => {
    const paths = {
      'weekly-tech-reports': '/weekly-tech-reports-archive',
      'ai-news': '/ai-news-archive',
      'combined-analysis': '/combined-analysis',
      'reddit-reports': '/reddit-reports-archive',
      'hackernews-reports': '/hackernews-reports-archive',
      'product-hunt-reports': '/product-hunt-reports-archive'
    };
    return paths[type] || '/archive';
  };

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setReadingProgress(Math.min(progress * 100, 100));
      
      // Minimize header after scrolling 200px
      setIsHeaderMinimized(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-6">
          <div className="relative">
            <LoadingSpinner
              size="large"
              color="blue"
              showText={false}
            />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Đang tải {getContentTypeName(contentType)}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Vui lòng chờ trong giây lát...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Không tìm thấy báo cáo
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Báo cáo này có thể đã bị xóa hoặc không tồn tại.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const issueNumber = getIssueNumber(report.filename);

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Header Section */}
        <header className={`bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white relative overflow-hidden transition-all duration-500 ${
          isHeaderMinimized ? 'py-4' : 'py-8 lg:py-16'
        }`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float-gentle"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-float-gentle" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float-gentle" style={{ animationDelay: '-4s' }}></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            {/* Navigation Bar */}
            <nav className="flex items-center justify-between mb-8">
              <button 
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Quay lại</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <SocialLinks />
                <div className="hidden md:flex items-center space-x-2 text-white/70 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>5 phút đọc</span>
                </div>
              </div>
            </nav>

            {/* Title Section */}
            <div className={`transition-all duration-500 ${isHeaderMinimized ? 'space-y-2' : 'space-y-6'}`}>
              {issueNumber && (
                <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  Số {issueNumber}
                </div>
              )}
              
              <h1 className={`font-bold text-white transition-all duration-500 ${
                isHeaderMinimized ? 'text-xl lg:text-2xl' : 'text-3xl lg:text-5xl'
              }`}>
                {report.filename?.replace(/\.vi\.md$/, '').replace(/\.md$/, '').replace(/issue-\d+-/, '') || getContentTypeName(contentType)}
              </h1>

              {!isHeaderMinimized && (
                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{formatDate(report.upload_date)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{getContentTypeName(contentType)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Content Card */}
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Content Header */}
            <div className="px-6 lg:px-12 py-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Nội dung chính
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Cập nhật công nghệ hàng tuần
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="px-6 lg:px-12 py-8">
              <MarkdownRenderer content={report.content} />
            </div>
          </article>

          {/* Footer Actions */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Thích nội dung này?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chia sẻ với bạn bè và đồng nghiệp
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Chia sẻ</span>
              </button>
              
              <button
                onClick={() => navigate(getArchivePath(contentType))}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Xem thêm</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WeeklyTechReportView;
