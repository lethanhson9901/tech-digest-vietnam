// src/pages/HomePage.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import TagComponent from '../components/TagComponent';
import { fetchLatestReport } from '../services/api';

const HomePage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const loadLatestReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestReport();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestReport();
    
    // Animation delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
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
    <div className={`max-w-5xl mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Enhanced Hero Section */}
      <div className="mb-16 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20 dark:opacity-10 animate-float-gentle"
               style={{ background: 'var(--gradient-primary)' }}></div>
          <div className="absolute top-20 right-1/4 w-48 h-48 rounded-full opacity-15 dark:opacity-5 animate-float-gentle"
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
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 text-neutral-600 dark:text-dark-text-secondary">
            📊 Cập nhật <span className="font-semibold text-primary-600 dark:text-dark-accent-primary-bg">xu hướng công nghệ</span> mới nhất từ hệ sinh thái công nghệ Việt Nam
          </p>
          
          {/* Feature badges */}
          <div className="flex justify-center items-center space-x-8 mt-8">
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
      
      {/* Enhanced Latest Report Card */}
      <div className="rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-2 mb-16 bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border-secondary"
           style={{ 
             boxShadow: 'var(--shadow-accent)'
           }}>
        <div className="px-8 py-10"
             style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-2xl backdrop-blur-sm"
                     style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">Latest Tech Digest</h1>
              </div>
              <p className="text-white/90 text-lg font-medium">{report.filename}</p>
            </div>
            {report.upload_date && (
              <div className="mt-6 lg:mt-0">
                <div className="text-white px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm"
                     style={{ 
                       background: 'rgba(255, 255, 255, 0.2)',
                       border: '1px solid rgba(255, 255, 255, 0.3)'
                     }}>
                  📅 {format(new Date(report.upload_date), 'MMMM d, yyyy')}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-8 relative">
          {/* Content Preview */}
          <div className={`prose prose-lg max-w-none transition-all duration-500 dark:prose-invert ${
            showFullContent ? 'max-h-none' : 'max-h-[400px] overflow-hidden'
          }`}
          style={{
            '--tw-prose-headings': 'var(--color-neutral-900)',
            '--tw-prose-body': 'var(--color-neutral-700)',
            '--tw-prose-links': 'var(--color-primary-600)',
          }}>
            <MarkdownRenderer content={report.content} />
          </div>
          
          {/* Enhanced gradient overlay when content is collapsed */}
          {!showFullContent && (
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                 style={{ 
                   background: 'linear-gradient(to top, var(--color-neutral-50) 0%, var(--color-neutral-50) 60%, transparent 100%)'
                 }}></div>
          )}
          
          {/* Enhanced action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`/reports/${report.id}`}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              style={{ 
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-secondary)'
              }}
            >
              📖 Đọc bài viết đầy đủ
              <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg text-primary-700 dark:text-dark-accent-primary-bg bg-primary-50 dark:bg-dark-bg-tertiary border-2 border-primary-200 dark:border-dark-border-secondary hover:bg-primary-100 dark:hover:bg-dark-border-primary hover:border-primary-300 dark:hover:border-dark-border-secondary"
            >
              {showFullContent ? '📤 Thu gọn' : '📥 Xem thêm'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Quick Links Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-dark-text-primary">
          Khám phá thêm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Archive Card */}
          <Link 
            to="/archive" 
            className="group rounded-3xl shadow-lg p-8 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border-secondary"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 bg-primary-100 dark:bg-dark-bg-tertiary">
                <svg className="h-8 w-8 text-primary-600 dark:text-dark-accent-primary-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-200 text-neutral-800 dark:text-dark-text-primary group-hover:text-primary-600 dark:group-hover:text-dark-accent-primary-bg">
              📚 Kho lưu trữ
            </h3>
            <p className="leading-relaxed mb-4 text-neutral-600 dark:text-dark-text-secondary">
              Duyệt tất cả các báo cáo công nghệ trước đây và tìm hiểu xu hướng phát triển.
            </p>
            <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform duration-200 text-primary-600 dark:text-dark-accent-primary-bg">
              Khám phá ngay
              <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          {/* Latest Reports Card */}
          <Link 
            to="/latest" 
            className="group rounded-3xl shadow-lg p-8 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border-secondary"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 bg-accent-emerald-light/10 dark:bg-dark-accent-emerald/10">
                <svg className="h-8 w-8 text-accent-emerald dark:text-dark-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-200 text-neutral-800 dark:text-dark-text-primary group-hover:text-accent-emerald dark:group-hover:text-dark-accent-emerald">
              ⚡ Báo cáo mới nhất
            </h3>
            <p className="leading-relaxed mb-4 text-neutral-600 dark:text-dark-text-secondary">
              Xem những thông tin công nghệ mới nhất và cập nhật từ thị trường Việt Nam.
            </p>
            <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform duration-200 text-accent-emerald dark:text-dark-accent-emerald">
              Xem ngay
              <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>

          {/* Combined Analysis Card */}
          <Link 
            to="/combined-analysis/latest" 
            className="group rounded-3xl shadow-lg p-8 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl relative overflow-hidden bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border-secondary"
          >
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-dark-accent-orange/5 dark:to-dark-accent-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg bg-accent-orange/10 dark:bg-dark-accent-orange/10">
                  <svg className="h-8 w-8 transition-colors duration-300 text-accent-orange dark:text-dark-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-200 text-neutral-800 dark:text-dark-text-primary group-hover:text-accent-orange dark:group-hover:text-dark-accent-orange">
                📊 Phân tích tổng hợp
              </h3>
              <p className="leading-relaxed mb-6 text-neutral-600 dark:text-dark-text-secondary">
                Phân tích chuyên sâu các xu hướng công nghệ và insights từ dữ liệu.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform duration-200 text-accent-orange dark:text-dark-accent-orange">
                  <span className="relative">
                    Phân tích ngay
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Action indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-xs px-3 py-1 rounded-full bg-accent-orange/10 dark:bg-dark-accent-orange/20 text-accent-orange dark:text-dark-accent-orange">
                    <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                    Mới nhất
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section - New */}
      <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-3xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary text-center mb-12">Tại sao chọn Tech Digest Vietnam?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-dark-accent-primary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Đáng tin cậy</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Thông tin được kiểm chứng và cập nhật chính xác</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-dark-accent-emerald/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Cập nhật thường xuyên</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Thông tin mới được cập nhật hàng ngày</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-dark-accent-secondary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-dark-accent-secondary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Dễ đọc</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Giao diện thân thiện và dễ sử dụng</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-dark-accent-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-dark-accent-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Chuyên sâu</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Phân tích chi tiết về công nghệ Việt Nam</p>
          </div>
        </div>
      </div>

      {/* Quick Links with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/archive" className="interactive-hover group">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-bg-secondary dark:to-dark-bg-tertiary p-6 rounded-xl border border-blue-200 dark:border-dark-border-secondary hover:border-blue-300 dark:hover:border-dark-border-primary transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 dark:bg-dark-accent-primary-bg rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white dark:text-dark-accent-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Browse Archive</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Explore our collection of tech reports</p>
          </div>
        </Link>

        <Link to="/latest" className="interactive-hover group">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-dark-bg-secondary dark:to-dark-bg-tertiary p-6 rounded-xl border border-green-200 dark:border-dark-border-secondary hover:border-green-300 dark:hover:border-dark-border-primary transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 dark:bg-dark-accent-emerald rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white dark:text-dark-accent-emerald-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Latest Report</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Read the most recent tech insights</p>
          </div>
        </Link>

        <Link to="/about" className="interactive-hover group">
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-dark-bg-secondary dark:to-dark-bg-tertiary p-6 rounded-xl border border-purple-200 dark:border-dark-border-secondary hover:border-purple-300 dark:hover:border-dark-border-primary transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500 dark:bg-dark-accent-secondary-bg rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white dark:text-dark-accent-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-2">About Us</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Learn more about Tech Digest Vietnam</p>
          </div>
        </Link>
      </div>

      {/* Tech Topics Showcase with new tag system */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600 dark:text-dark-accent-primary-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Popular Tech Topics
        </h3>
        <p className="text-gray-600 dark:text-dark-text-secondary mb-6">Explore the latest trends in technology and innovation</p>
        
        <div className="space-y-6">
          {/* AI & Machine Learning */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-3">Artificial Intelligence & Machine Learning</h4>
            <div className="flex flex-wrap gap-2">
              <TagComponent variant="primary" size="medium">AI Development</TagComponent>
              <TagComponent variant="info" size="medium">Machine Learning</TagComponent>
              <TagComponent variant="success" size="medium">Deep Learning</TagComponent>
              <TagComponent variant="warning" size="medium">Neural Networks</TagComponent>
              <TagComponent variant="secondary" size="medium">Computer Vision</TagComponent>
            </div>
          </div>

          {/* Web Technologies */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-3">Web Technologies</h4>
            <div className="flex flex-wrap gap-2">
              <TagComponent variant="primary" size="small">React</TagComponent>
              <TagComponent variant="info" size="small">Node.js</TagComponent>
              <TagComponent variant="success" size="small">TypeScript</TagComponent>
              <TagComponent variant="warning" size="small">GraphQL</TagComponent>
              <TagComponent variant="danger" size="small">WebAssembly</TagComponent>
              <TagComponent variant="secondary" size="small">Progressive Web Apps</TagComponent>
            </div>
          </div>

          {/* Cloud & DevOps */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-3">Cloud & DevOps</h4>
            <div className="flex flex-wrap gap-2">
              <TagComponent variant="primary" size="large">AWS</TagComponent>
              <TagComponent variant="info" size="medium">Docker</TagComponent>
              <TagComponent variant="success" size="medium">Kubernetes</TagComponent>
              <TagComponent variant="warning" size="medium">CI/CD</TagComponent>
              <TagComponent variant="secondary" size="medium">Microservices</TagComponent>
            </div>
          </div>

          {/* Emerging Technologies */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-3">Emerging Technologies</h4>
            <div className="flex flex-wrap gap-2">
              <TagComponent variant="primary" size="medium" closable onClose={() => console.log('Closed Blockchain')}>
                Blockchain
              </TagComponent>
              <TagComponent variant="info" size="medium" closable onClose={() => console.log('Closed IoT')}>
                Internet of Things
              </TagComponent>
              <TagComponent variant="success" size="medium" closable onClose={() => console.log('Closed Quantum')}>
                Quantum Computing
              </TagComponent>
              <TagComponent variant="warning" size="medium" closable onClose={() => console.log('Closed AR/VR')}>
                AR/VR
              </TagComponent>
              <TagComponent variant="danger" size="medium" closable onClose={() => console.log('Closed Edge')}>
                Edge Computing
              </TagComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Features section with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="bg-blue-100 dark:bg-dark-accent-primary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Đáng tin cậy</h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Thông tin được kiểm chứng và cập nhật chính xác</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 dark:bg-dark-accent-emerald/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Cập nhật thường xuyên</h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Thông tin mới được cập nhật hàng ngày</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 dark:bg-dark-accent-secondary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600 dark:text-dark-accent-secondary-bg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Dễ đọc</h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Giao diện thân thiện và dễ sử dụng</p>
        </div>
        <div className="text-center">
          <div className="bg-orange-100 dark:bg-dark-accent-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600 dark:text-dark-accent-orange" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-dark-text-primary mb-2">Chuyên sâu</h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm">Phân tích chi tiết về công nghệ Việt Nam</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
