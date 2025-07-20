import { format } from 'date-fns';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';
import TableOfContents from './TableOfContents';
import TagComponent from './TagComponent';

// Lazy Loading Hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        setHasIntersected(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isIntersecting, hasIntersected];
};

// Lazy Loaded Card Component
const LazySubredditCard = ({ subredditReport, index, onViewDetail }) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  if (!hasIntersected) {
    return (
      <div ref={ref} className="p-4 lg:p-6 rounded-2xl bg-gray-800/50 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const data = subredditReport.structured_data;
  
  return (
    <div ref={ref} className="p-4 lg:p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800/50 border-[#E5E7EB] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm dark:shadow-gray-900/20">
      {/* Subreddit Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">
            🏛️ r/{data.subreddit || `subreddit-${index + 1}`}
          </h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#3B82F6] text-white">
            #{index + 1}
          </span>
        </div>
        <p className="text-sm text-[#4B5563] dark:text-gray-400 line-clamp-2">
          {data.reportTitle}
        </p>
      </div>

      {/* Executive Summary - Collapsed by default */}
      {data.executiveSummary && (
        <div className="mb-4">
          <details className="group">
            <summary className="cursor-pointer text-sm text-[#4B5563] dark:text-gray-300 hover:text-[#1F2937] dark:hover:text-white transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Tóm tắt chuyên sâu
            </summary>
            <div className="mt-2 p-3 rounded-lg bg-[#EFF6FF] dark:bg-gray-800/50 border border-[#DBEAFE] dark:border-gray-700/50">
              <p className="text-xs text-[#4B5563] dark:text-gray-400 line-clamp-3">
                {data.executiveSummary}
              </p>
            </div>
          </details>
        </div>
      )}

      {/* Community Mood */}
      {data.communityMood && (
        <div className="mb-4 p-3 rounded-lg bg-[#EFF6FF] dark:bg-purple-900/20 border border-[#DBEAFE] dark:border-purple-700/30">
          <p className="text-xs text-[#4B5563] dark:text-purple-300 italic line-clamp-2">
            "{data.communityMood}"
          </p>
        </div>
      )}

      {/* Trending Topics */}
      {data.trendingTopics && data.trendingTopics.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#1F2937] dark:text-white mb-2">Chủ đề nổi bật:</h4>
          <div className="flex flex-wrap gap-1">
            {data.trendingTopics.slice(0, 3).map((topic, topicIndex) => (
              <span key={topicIndex} 
                    className="text-xs px-2 py-1 rounded-full bg-[#DBEAFE] dark:bg-orange-600/20 text-[#3B82F6] dark:text-orange-300 border border-[#BFDBFE] dark:border-orange-600/30">
                {topic}
              </span>
            ))}
            {data.trendingTopics.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#F3F4F6] dark:bg-gray-700 text-[#4B5563] dark:text-gray-300">
                +{data.trendingTopics.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sample Articles */}
      {data.sections && data.sections.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#1F2937] dark:text-white mb-2">Bài viết tiêu biểu:</h4>
          <div className="space-y-2">
            {data.sections.slice(0, 2).map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h5 className="text-xs font-medium text-[#6B7280] dark:text-gray-300 mb-1">{section.title}</h5>
                {section.articles && section.articles.slice(0, 2).map((article, articleIndex) => (
                  <div key={articleIndex} className="p-2 rounded-lg bg-[#F9FAFB] dark:bg-gray-800/50 border border-[#E5E7EB] dark:border-gray-700/50">
                    <div className="flex items-start justify-between mb-1">
                      <h6 className="text-xs font-medium text-[#1F2937] dark:text-white line-clamp-2 flex-1 mr-2">
                        {article.headline}
                      </h6>
                      <div className="flex items-center space-x-1 text-xs flex-shrink-0">
                        <span className="px-1 py-0.5 rounded bg-[#D1FAE5] dark:bg-green-600/20 text-[#10B981] dark:text-green-300 border border-[#A7F3D0] dark:border-green-600/30">
                          {article.score}↑
                        </span>
                        <span className="px-1 py-0.5 rounded bg-[#DBEAFE] dark:bg-blue-600/20 text-[#3B82F6] dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-600/30">
                          {article.numComments}💬
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#4B5563] dark:text-gray-400 line-clamp-2 mb-1">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-gray-500">
                        {article.source}
                      </span>
                      {article.link && (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#3B82F6] dark:text-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 transition-colors"
                        >
                          Xem →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Full Report Button */}
      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-gray-700/50">
        <button
          onClick={() => onViewDetail(data)}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem báo cáo chi tiết
        </button>
      </div>
    </div>
  );
};

// Search and Filter Component
const SearchAndFilter = ({ onSearch, onFilter, totalCount, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const categories = [
    { value: 'all', label: 'Tất cả', icon: '🏠' },
    { value: 'tech', label: 'Công nghệ', icon: '💻' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'science', label: 'Khoa học', icon: '🔬' },
    { value: 'news', label: 'Tin tức', icon: '📰' },
    { value: 'entertainment', label: 'Giải trí', icon: '🎭' }
  ];

  const sortOptions = [
    { value: 'score', label: 'Điểm cao nhất', icon: '⬆️' },
    { value: 'comments', label: 'Nhiều bình luận', icon: '💬' },
    { value: 'alphabetical', label: 'A-Z', icon: '🔤' },
    { value: 'recent', label: 'Mới nhất', icon: '🕒' }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilter({ category, sortBy });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onFilter({ category: selectedCategory, sortBy: sort });
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-[#E5E7EB] dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm subreddit, chủ đề..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] dark:bg-gray-700 border border-[#D1D5DB] dark:border-gray-600 rounded-lg text-[#1F2937] dark:text-white placeholder-[#6B7280] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-[#6B7280] dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'bg-[#F3F4F6] dark:bg-gray-700 text-[#4B5563] dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[#6B7280] dark:text-gray-400">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 bg-[#F3F4F6] dark:bg-gray-700 border border-[#D1D5DB] dark:border-gray-600 rounded-lg text-[#1F2937] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280] dark:text-gray-400">
            Hiển thị {filteredCount} / {totalCount} subreddits
          </span>
          {searchTerm && (
            <span className="text-[#3B82F6] dark:text-blue-400">
              Kết quả tìm kiếm: "{searchTerm}"
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Detail Modal Component
const SubredditDetailModal = ({ isOpen, onClose, subredditData, subredditName }) => {
  if (!isOpen || !subredditData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                🏛️ r/{subredditName}
              </h2>
              <p className="text-gray-400 mt-1">
                Báo cáo chi tiết subreddit
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            {/* Executive Summary */}
            {subredditData.executiveSummary && (
              <div className="mb-8 p-6 rounded-xl bg-gray-800 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tóm tắt chuyên sâu
                </h3>
                <div className="prose prose-lg max-w-none text-gray-300">
                  <MarkdownRenderer content={subredditData.executiveSummary} />
                </div>
              </div>
            )}

            {/* Community Mood */}
            {subredditData.communityMood && (
              <div className="mb-8 p-6 rounded-xl bg-purple-900/30 border border-purple-700/30">
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tâm trạng cộng đồng
                </h3>
                <p className="text-lg text-gray-300 italic">
                  "{subredditData.communityMood}"
                </p>
              </div>
            )}

            {/* Trending Topics */}
            {subredditData.trendingTopics && subredditData.trendingTopics.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Chủ đề nổi bật
                </h3>
                <div className="flex flex-wrap gap-3">
                  {subredditData.trendingTopics.map((topic, index) => (
                    <span key={index} 
                          className="px-4 py-2 rounded-full bg-orange-600/20 text-orange-300 border border-orange-600/30 text-sm font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            {subredditData.sections && subredditData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {section.title}
                </h3>
                
                <div className="space-y-6">
                  {section.articles && section.articles.map((article, articleIndex) => (
                    <div key={articleIndex} className="p-6 rounded-xl bg-gray-800 border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white flex-1 mr-4">
                          {article.headline}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="px-3 py-1 rounded-lg bg-green-600/20 text-green-300 border border-green-600/30 text-sm">
                            {article.score} ↑
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-600/30 text-sm">
                            {article.numComments} 💬
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 text-gray-300">
                        <MarkdownRenderer content={article.summary} />
                      </div>

                      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-white mb-2">Điểm chính:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {article.keyTakeaways.map((takeaway, index) => (
                              <li key={index}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-sm text-gray-400">
                          Tác giả: {article.source}
                        </span>
                        {article.flair && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-orange-600/20 text-orange-300 border border-orange-600/30">
                            {article.flair}
                          </span>
                        )}
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map((tag, index) => (
                            <span key={index} 
                                  className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {article.link && (
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Xem trên Reddit
                          </a>
                        )}
                        {article.originalUrl && (
                          <a
                            href={article.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Link gốc
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = ({ reports }) => {
  const stats = useMemo(() => {
    if (!reports || reports.length === 0) return null;

    const totalSubreddits = reports.length;
    const totalArticles = reports.reduce((sum, report) => {
      const sections = report.structured_data?.sections || [];
      return sum + sections.reduce((sectionSum, section) => {
        return sectionSum + (section.articles?.length || 0);
      }, 0);
    }, 0);

    const totalScore = reports.reduce((sum, report) => {
      const sections = report.structured_data?.sections || [];
      return sum + sections.reduce((sectionSum, section) => {
        return sectionSum + (section.articles?.reduce((articleSum, article) => {
          return articleSum + (article.score || 0);
        }, 0) || 0);
      }, 0);
    }, 0);

    const totalComments = reports.reduce((sum, report) => {
      const sections = report.structured_data?.sections || [];
      return sum + sections.reduce((sectionSum, section) => {
        return sectionSum + (section.articles?.reduce((articleSum, article) => {
          return articleSum + (article.numComments || 0);
        }, 0) || 0);
      }, 0);
    }, 0);

    // Top trending topics
    const allTopics = reports.reduce((topics, report) => {
      const trendingTopics = report.structured_data?.trendingTopics || [];
      return [...topics, ...trendingTopics];
    }, []);

    const topicCounts = allTopics.reduce((counts, topic) => {
      counts[topic] = (counts[topic] || 0) + 1;
      return counts;
    }, {});

    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    // Community mood analysis
    const moods = reports
      .map(report => report.structured_data?.communityMood)
      .filter(Boolean);

    const positiveMoods = moods.filter(mood => 
      mood.toLowerCase().includes('positive') || 
      mood.toLowerCase().includes('optimistic') ||
      mood.toLowerCase().includes('excited')
    ).length;

    const neutralMoods = moods.filter(mood => 
      mood.toLowerCase().includes('neutral') || 
      mood.toLowerCase().includes('mixed') ||
      mood.toLowerCase().includes('balanced')
    ).length;

    const negativeMoods = moods.length - positiveMoods - neutralMoods;

    return {
      totalSubreddits,
      totalArticles,
      totalScore,
      totalComments,
      avgScore: totalArticles > 0 ? Math.round(totalScore / totalArticles) : 0,
      avgComments: totalArticles > 0 ? Math.round(totalComments / totalArticles) : 0,
      topTopics,
      moodAnalysis: { positive: positiveMoods, neutral: neutralMoods, negative: negativeMoods }
    };
  }, [reports]);

  if (!stats) return null;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Key Metrics */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280] dark:text-gray-300">Subreddits</p>
            <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{stats.totalSubreddits}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] dark:bg-blue-600/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#3B82F6] dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280] dark:text-gray-300">Bài viết</p>
            <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{stats.totalArticles}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] dark:bg-green-600/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#10B981] dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280] dark:text-gray-300">Điểm TB</p>
            <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{stats.avgScore}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] dark:bg-orange-600/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F59E0B] dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280] dark:text-gray-300">Bình luận TB</p>
            <p className="text-2xl font-bold text-[#1F2937] dark:text-white">{stats.avgComments}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] dark:bg-purple-600/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#6366F1] dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Virtual Scrolling Component for Performance
const VirtualizedGrid = ({ items, renderItem, itemHeight = 400, containerHeight = 800 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div 
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RedditReportView = ({ report, isLoading, error }) => {
  const navigate = useNavigate();
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  // Parse the content if it's a string - moved before early returns
  let reportData = report;
  if (typeof report?.content === 'string') {
    try {
      reportData = JSON.parse(report.content);
    } catch (e) {
      console.error('Error parsing reddit report content:', e);
      reportData = null;
    }
  }

  // Handle combined reddit report structure
  const isCombinedReport = reportData?.subredditReports && Array.isArray(reportData.subredditReports);
  
  // Filter and process reports with search, filter, and sort - moved before early returns
  const processedReports = useMemo(() => {
    if (!isCombinedReport || !reportData?.subredditReports) {
      return [];
    }

    let filtered = reportData.subredditReports.filter(report => report.success && report.structured_data);
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => {
        const data = report.structured_data;
        return (
          data.subreddit?.toLowerCase().includes(searchLower) ||
          data.reportTitle?.toLowerCase().includes(searchLower) ||
          data.executiveSummary?.toLowerCase().includes(searchLower) ||
          data.trendingTopics?.some(topic => topic.toLowerCase().includes(searchLower)) ||
          data.sections?.some(section => 
            section.title?.toLowerCase().includes(searchLower) ||
            section.articles?.some(article => 
              article.headline?.toLowerCase().includes(searchLower) ||
              article.summary?.toLowerCase().includes(searchLower)
            )
          )
        );
      });
    }
    
    // Category filter (simplified - can be enhanced with actual category detection)
    if (filterCategory !== 'all') {
      filtered = filtered.filter(report => {
        const data = report.structured_data;
        const subreddit = data.subreddit?.toLowerCase() || '';
        const title = data.reportTitle?.toLowerCase() || '';
        
        switch (filterCategory) {
          case 'tech':
            return subreddit.includes('tech') || subreddit.includes('programming') || 
                   title.includes('tech') || title.includes('programming');
          case 'gaming':
            return subreddit.includes('gaming') || subreddit.includes('game') || 
                   title.includes('gaming') || title.includes('game');
          case 'science':
            return subreddit.includes('science') || subreddit.includes('research') || 
                   title.includes('science') || title.includes('research');
          case 'news':
            return subreddit.includes('news') || subreddit.includes('worldnews') || 
                   title.includes('news') || title.includes('world');
          case 'entertainment':
            return subreddit.includes('entertainment') || subreddit.includes('movies') || 
                   title.includes('entertainment') || title.includes('movie');
          default:
            return true;
        }
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      const dataA = a.structured_data;
      const dataB = b.structured_data;
      
      switch (sortBy) {
        case 'score':
          const scoreA = dataA.sections?.reduce((sum, section) => 
            sum + (section.articles?.reduce((articleSum, article) => 
              articleSum + (article.score || 0), 0) || 0), 0) || 0;
          const scoreB = dataB.sections?.reduce((sum, section) => 
            sum + (section.articles?.reduce((articleSum, article) => 
              articleSum + (article.score || 0), 0) || 0), 0) || 0;
          return scoreB - scoreA;
        case 'comments':
          const commentsA = dataA.sections?.reduce((sum, section) => 
            sum + (section.articles?.reduce((articleSum, article) => 
              articleSum + (article.numComments || 0), 0) || 0), 0) || 0;
          const commentsB = dataB.sections?.reduce((sum, section) => 
            sum + (section.articles?.reduce((articleSum, article) => 
              articleSum + (article.numComments || 0), 0) || 0), 0) || 0;
          return commentsB - commentsA;
        case 'alphabetical':
          return (dataA.subreddit || '').localeCompare(dataB.subreddit || '');
        case 'recent':
          return new Date(dataB.analysisDate || 0) - new Date(dataA.analysisDate || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [isCombinedReport, reportData?.subredditReports, searchTerm, filterCategory, sortBy]);

  // Early returns after all hooks
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!report || !reportData) {
    return <ErrorMessage message="Reddit Report not found" />;
  }

  if (!isCombinedReport) {
    // Handle single subreddit report structure
    const { 
      reportTitle, 
      subreddit, 
      analysisDate, 
      totalPosts, 
      executiveSummary, 
      sections = [] 
    } = reportData;

    // Generate table of contents from sections
    const tocItems = sections.map((section, index) => ({
      id: `section-${index}`,
      title: section.title,
      level: 2
    }));

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
             style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--gradient-primary)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-white">
                    {reportTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      r/{subreddit}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {analysisDate ? format(new Date(analysisDate), 'dd/MM/yyyy') : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {totalPosts} bài viết
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => navigate('/reddit-reports-archive')}
                className="inline-flex items-center px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Xem tất cả
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-white text-[#3B82F6] border border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                title="Làm mới để lấy báo cáo mới nhất"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Mobile TOC Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl backdrop-blur-lg"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <span className="font-medium text-white">
              Mục lục
            </span>
            <svg 
              className={`w-5 h-5 transition-transform text-gray-400 ${isMobileTocOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isMobileTocOpen && (
            <div className="mt-2 p-4 rounded-xl backdrop-blur-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <TableOfContents items={tocItems} />
            </div>
          )}
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Desktop Table of Contents */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-8">
              <TableOfContents items={tocItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Executive Summary */}
            {executiveSummary && (
              <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                   style={{ background: 'rgba(255,255,255,0.08)' }}>
                <h2 className="text-xl font-bold mb-4 text-white">
                  Tóm tắt chuyên sâu
                </h2>
                <div className="prose prose-lg max-w-none text-gray-300">
                  <MarkdownRenderer content={executiveSummary} />
                </div>
              </div>
            )}

            {/* Sections */}
            {sections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex}
                id={`section-${sectionIndex}`}
                className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <h2 className="text-xl font-bold mb-6 text-white">
                  {section.title}
                </h2>
                
                <div className="space-y-6">
                  {section.articles?.map((article, articleIndex) => (
                    <div 
                      key={articleIndex}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold flex-1 text-white">
                          {article.headline}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-sm px-2 py-1 rounded-lg"
                                style={{ 
                                  background: 'var(--color-primary-500)',
                                  color: 'white'
                                }}>
                            {article.score} ↑
                          </span>
                          <span className="text-sm px-2 py-1 rounded-lg"
                                style={{ 
                                  background: 'var(--color-accent-blue)',
                                  color: 'white'
                                }}>
                            {article.numComments} 💬
                          </span>
                        </div>
                      </div>

                      <div className="mb-3"
                           style={{ color: 'var(--color-neutral-300)' }}>
                        <MarkdownRenderer content={article.summary} />
                      </div>

                      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-semibold mb-2"
                              style={{ color: 'var(--color-neutral-200)' }}>
                            Điểm chính:
                          </h4>
                          <ul className="list-disc list-inside space-y-1"
                              style={{ color: 'var(--color-neutral-300)' }}>
                            {article.keyTakeaways.map((takeaway, index) => (
                              <li key={index}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm"
                              style={{ color: 'var(--color-neutral-400)' }}>
                          Tác giả: {article.source}
                        </span>
                        {article.flair && (
                          <span className="text-xs px-2 py-1 rounded-lg"
                                style={{ 
                                  background: 'var(--color-accent-orange)',
                                  color: 'white'
                                }}>
                            {article.flair}
                          </span>
                        )}
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag, index) => (
                            <TagComponent key={index} tag={tag} />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {article.link && (
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                            style={{ 
                              background: 'var(--color-primary-500)',
                              color: 'white'
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Xem trên Reddit
                          </a>
                        )}
                        {article.originalUrl && (
                          <a
                            href={article.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                            style={{ 
                              background: 'var(--color-accent-blue)',
                              color: 'white'
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Link gốc
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12">
          <SocialLinks 
            title={reportTitle}
            url={window.location.href}
          />
        </div>
      </div>
    );
  }

  // This is a combined report with multiple subreddits
  const { 
    reportTitle, 
    analysisDate, 
    totalSubreddits, 
    subredditReports = [] 
  } = reportData;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg bg-[#F8F9FA] dark:bg-gray-800/50 border border-[#E5E7EB] dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        
        {/* Analytics Dashboard */}
        <AnalyticsDashboard reports={processedReports} />
        
        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={setSearchTerm}
          onFilter={({ category, sortBy: sort }) => {
            setFilterCategory(category);
            setSortBy(sort);
          }}
          totalCount={subredditReports.length}
          filteredCount={processedReports.length}
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#3B82F6]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-[#1F2937] dark:text-white">
                  {reportTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280] dark:text-gray-300">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {analysisDate ? format(new Date(analysisDate), 'dd/MM/yyyy') : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {processedReports.length} subreddits
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => navigate('/reddit-reports-archive')}
              className="inline-flex items-center px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              Xem tất cả
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-white text-[#3B82F6] border border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
              title="Làm mới để lấy báo cáo mới nhất"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Subreddit Reports Grid - Show All Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {processedReports.map((subredditReport, index) => {
          return (
            <LazySubredditCard
              key={index}
              subredditReport={subredditReport}
              index={index}
              onViewDetail={(data) => {
                setSelectedSubreddit(data);
                setIsDetailModalOpen(true);
              }}
            />
          );
        })}
      </div>

      {/* Social Links */}
      <div className="mt-12">
        <SocialLinks 
          title={reportTitle}
          url={window.location.href}
        />
      </div>

      {/* Detail Modal */}
      <SubredditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSubreddit(null);
        }}
        subredditData={selectedSubreddit}
        subredditName={selectedSubreddit?.subreddit || 'Unknown'}
      />
    </div>
  );
};

export default RedditReportView; 