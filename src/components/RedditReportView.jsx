import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';
// import TableOfContents from './TableOfContents'; // Unused import
// import TagComponent from './TagComponent'; // Unused import

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
  const [ref, , hasIntersected] = useIntersectionObserver({
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

  return (
    <div ref={ref} className="p-4 lg:p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800/50 border-neutral-200 dark:border-gray-700 hover:border-neutral-300 dark:hover:border-gray-600 shadow-sm dark:shadow-gray-900/20">
      {/* Subreddit Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-primary">
            🏛️ r/{subredditReport.subreddit || `subreddit-${index + 1}`}
          </h2>
          <span className="text-xs px-2 py-1 rounded-full bg-primary-600 text-inverse">
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Executive Summary - Collapsed by default */}
      {subredditReport.executive_summary && (
        <div className="mb-4">
          <details className="group">
            <summary className="cursor-pointer text-sm text-secondary hover:text-primary transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Tóm tắt chuyên sâu
            </summary>
            <div className="mt-2 p-3 rounded-lg bg-primary-50 dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700/50">
              <p className="text-xs text-muted line-clamp-3">
                {subredditReport.executive_summary}
              </p>
            </div>
          </details>
        </div>
      )}

      {/* Community Mood */}
      {subredditReport.community_mood && (
        <div className="mb-4 p-3 rounded-lg bg-primary-50 dark:bg-purple-900/20 border border-primary-200 dark:border-purple-700/30">
          <p className="text-xs text-secondary dark:text-purple-300 italic line-clamp-2">
            "{subredditReport.community_mood}"
          </p>
        </div>
      )}

      {/* Key Posts Analysis */}
      {subredditReport.key_posts_analysis && subredditReport.key_posts_analysis.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Bài viết quan trọng:</h4>
          <div className="space-y-2">
            {subredditReport.key_posts_analysis.slice(0, 2).map((post, postIndex) => (
              <div key={postIndex} className="p-2 rounded-lg bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700/50">
                <div className="flex items-start justify-between mb-1">
                  <h6 className="text-xs font-medium text-primary line-clamp-2 flex-1 mr-2">
                    {post.post_title}
                  </h6>
                  <div className="flex items-center space-x-1 text-xs flex-shrink-0">
                    <span className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-dark-accent-emerald/20 text-emerald-600 dark:text-dark-accent-emerald border border-emerald-200 dark:border-dark-accent-emerald/30">
                      {post.upvotes}↑
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted line-clamp-2 mb-1">
                  {post.analysis}
                </p>
                
                <div className="flex items-center justify-between">
                  {post.post_url && (
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      Xem →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emerging Trends */}
      {subredditReport.emerging_trends && subredditReport.emerging_trends.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Xu hướng mới:</h4>
          <div className="flex flex-wrap gap-1">
            {subredditReport.emerging_trends.slice(0, 3).map((trend, trendIndex) => (
              <span
                key={trendIndex}
                className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-dark-accent-primary-bg/20 text-primary-600 dark:text-dark-accent-primary-bg border border-primary-200 dark:border-gray-600"
              >
                {trend.trend}
              </span>
            ))}
            {subredditReport.emerging_trends.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-secondary dark:text-gray-300 border border-neutral-200 dark:border-gray-600">
                +{subredditReport.emerging_trends.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sentiment Analysis */}
      {subredditReport.sentiment_analysis && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Phân tích tình cảm:</h4>
          <div className="flex flex-wrap gap-1">
            {subredditReport.sentiment_analysis.positive_themes && subredditReport.sentiment_analysis.positive_themes.slice(0, 2).map((theme, themeIndex) => (
              <span
                key={themeIndex}
                className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-700/30"
              >
                😊 {theme}
              </span>
            ))}
            {subredditReport.sentiment_analysis.negative_themes && subredditReport.sentiment_analysis.negative_themes.slice(0, 1).map((theme, themeIndex) => (
              <span
                key={themeIndex}
                className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700/30"
              >
                😞 {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View Full Report Button */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-gray-700/50">
        <button
          onClick={() => onViewDetail(subredditReport)}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-inverse rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
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
const SearchAndFilter = ({ onSearch, onSortChange, totalCount, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // Mặc định sort theo upvotes cao nhất

  // Removed category filters to simplify UI per request

  const sortOptions = [
    { value: 'score', label: 'Upvotes cao nhất', icon: '⬆️' },
    { value: 'alphabetical', label: 'A-Z', icon: '🔤' },
    { value: 'recent', label: 'Mới nhất', icon: '🕒' }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm subreddit, chủ đề..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-gray-700 border border-neutral-300 dark:border-gray-600 rounded-lg text-primary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-muted dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 bg-neutral-100 dark:bg-gray-700 border border-neutral-300 dark:border-gray-600 rounded-lg text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            Hiển thị {filteredCount} / {totalCount} subreddits
          </span>
          {searchTerm && (
            <span className="text-primary-600 dark:text-primary-400">
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
      <div className="fixed inset-0 bg-black/75 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-neutral-200 dark:border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-white">
                🏛️ r/{subredditName}
              </h2>
              <p className="text-secondary dark:text-gray-400 mt-1">
                Báo cáo chi tiết subreddit
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-gray-800 hover:bg-neutral-200 dark:hover:bg-gray-700 text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            {/* Executive Summary */}
            {subredditData.executive_summary && (
              <div className="mb-8 p-6 rounded-xl bg-neutral-50 dark:bg-gray-800/60 border border-neutral-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tóm tắt chuyên sâu
                </h3>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <MarkdownRenderer content={subredditData.executive_summary} />
                </div>
              </div>
            )}

            {/* Community Mood */}
            {subredditData.community_mood && (
              <div className="mb-8 p-6 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/30">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tâm trạng cộng đồng
                </h3>
                <p className="text-lg text-secondary dark:text-gray-300 italic">
                  "{subredditData.community_mood}"
                </p>
              </div>
            )}

            {/* Key Posts Analysis */}
            {subredditData.key_posts_analysis && subredditData.key_posts_analysis.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Bài viết quan trọng
                </h3>
                
                <div className="space-y-6">
                  {subredditData.key_posts_analysis.map((post, postIndex) => (
                    <div key={postIndex} className="p-6 rounded-xl bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-primary dark:text-white flex-1 mr-4">
                          {post.post_title}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-green-600/20 dark:text-green-300 dark:border-green-600/30 text-sm">
                            {post.upvotes} ↑
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 text-secondary dark:text-gray-300">
                        <MarkdownRenderer content={post.analysis} />
                      </div>

                      {post.key_takeaways && post.key_takeaways.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-primary dark:text-white mb-2">Điểm chính:</h5>
                          <ul className="list-disc list-inside space-y-1 text-secondary dark:text-gray-300">
                            {post.key_takeaways.map((takeaway, index) => (
                              <li key={index}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {post.post_url && (
                          <a
                            href={post.post_url}
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emerging Trends */}
            {subredditData.emerging_trends && subredditData.emerging_trends.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Xu hướng mới nổi
                </h3>
                <div className="space-y-4">
                  {subredditData.emerging_trends.map((trend, index) => (
                    <div key={index} className="p-4 rounded-xl bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700">
                      <h4 className="font-semibold text-primary dark:text-white mb-2">
                        {trend.trend}
                      </h4>
                      <p className="text-secondary dark:text-gray-300 mb-3">
                        {trend.description}
                      </p>
                      {trend.examples && trend.examples.length > 0 && (
                        <div>
                          <h5 className="font-medium text-primary dark:text-white mb-2">Ví dụ:</h5>
                          <ul className="list-disc list-inside space-y-1 text-secondary dark:text-gray-300">
                            {trend.examples.map((example, exampleIndex) => (
                              <li key={exampleIndex}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment Analysis */}
            {subredditData.sentiment_analysis && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Phân tích tình cảm
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subredditData.sentiment_analysis.positive_themes && subredditData.sentiment_analysis.positive_themes.length > 0 && (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                        😊 Chủ đề tích cực
                      </h4>
                      <ul className="space-y-1">
                        {subredditData.sentiment_analysis.positive_themes.map((theme, index) => (
                          <li key={index} className="text-sm text-green-600 dark:text-green-400">• {theme}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {subredditData.sentiment_analysis.negative_themes && subredditData.sentiment_analysis.negative_themes.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center">
                        😞 Chủ đề tiêu cực
                      </h4>
                      <ul className="space-y-1">
                        {subredditData.sentiment_analysis.negative_themes.map((theme, index) => (
                          <li key={index} className="text-sm text-red-600 dark:text-red-400">• {theme}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {subredditData.sentiment_analysis.neutral_themes && subredditData.sentiment_analysis.neutral_themes.length > 0 && (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        😐 Chủ đề trung lập
                      </h4>
                      <ul className="space-y-1">
                        {subredditData.sentiment_analysis.neutral_themes.map((theme, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">• {theme}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
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
    const totalPosts = reports.reduce((sum, report) => {
      return sum + (report.key_posts_analysis?.length || 0);
    }, 0);

    const totalUpvotes = reports.reduce((sum, report) => {
      return sum + (report.key_posts_analysis?.reduce((postSum, post) => {
        return postSum + (post.upvotes || 0);
      }, 0) || 0);
    }, 0);

    // Top emerging trends
    const allTrends = reports.reduce((trends, report) => {
      const emergingTrends = report.emerging_trends || [];
      return [...trends, ...emergingTrends];
    }, []);

    const trendCounts = allTrends.reduce((counts, trend) => {
      counts[trend.trend] = (counts[trend.trend] || 0) + 1;
      return counts;
    }, {});

    const topTrends = Object.entries(trendCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trend, count]) => ({ trend, count }));

    // Sentiment analysis
    const allSentiments = reports
      .map(report => report.sentiment_analysis)
      .filter(Boolean);

    const positiveThemes = allSentiments.reduce((sum, sentiment) => {
      return sum + (sentiment.positive_themes?.length || 0);
    }, 0);

    const negativeThemes = allSentiments.reduce((sum, sentiment) => {
      return sum + (sentiment.negative_themes?.length || 0);
    }, 0);

    const neutralThemes = allSentiments.reduce((sum, sentiment) => {
      return sum + (sentiment.neutral_themes?.length || 0);
    }, 0);

    return {
      totalSubreddits,
      totalPosts,
      totalUpvotes,
      avgUpvotes: totalPosts > 0 ? Math.round(totalUpvotes / totalPosts) : 0,
      topTrends,
      sentimentAnalysis: { 
        positive: positiveThemes, 
        negative: negativeThemes, 
        neutral: neutralThemes 
      }
    };
  }, [reports]);

  if (!stats) return null;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Key Metrics */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted dark:text-gray-300">Subreddits</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{stats.totalSubreddits}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-blue-600/30 dark:text-blue-300 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted dark:text-gray-300">Bài viết</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{stats.totalPosts}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-green-600/30 dark:text-green-300 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted dark:text-gray-300">Upvotes TB</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{stats.avgUpvotes}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 dark:bg-orange-600/30 dark:text-orange-300 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted dark:text-gray-300">Tổng upvotes</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{stats.totalUpvotes}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-purple-600/30 dark:text-purple-300 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Virtual Scrolling Component for Performance
// (Đã loại bỏ VirtualizedGrid vì không sử dụng)

const RedditReportView = ({ report, isLoading, error }) => {
  const navigate = useNavigate();
  // const [isMobileTocOpen, setIsMobileTocOpen] = useState(false); // Unused state
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // Mặc định sort theo upvotes cao nhất

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
  const isCombinedReport = reportData?.subreddit_reports && Array.isArray(reportData.subreddit_reports);
  
  // Filter and process reports with search, filter, and sort - moved before early returns
  const processedReports = useMemo(() => {
    if (!isCombinedReport || !reportData?.subreddit_reports) {
      return [];
    }

    let filtered = reportData.subreddit_reports;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => {
        return (
          report.subreddit?.toLowerCase().includes(searchLower) ||
          report.executive_summary?.toLowerCase().includes(searchLower) ||
          report.community_mood?.toLowerCase().includes(searchLower) ||
          report.key_posts_analysis?.some(post => 
            post.post_title?.toLowerCase().includes(searchLower) ||
            post.analysis?.toLowerCase().includes(searchLower)
          ) ||
          report.emerging_trends?.some(trend => 
            trend.trend?.toLowerCase().includes(searchLower) ||
            trend.description?.toLowerCase().includes(searchLower)
          )
        );
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          const scoreA = a.key_posts_analysis?.reduce((sum, post) => sum + (post.upvotes || 0), 0) || 0;
          const scoreB = b.key_posts_analysis?.reduce((sum, post) => sum + (post.upvotes || 0), 0) || 0;
          return scoreB - scoreA;
        case 'alphabetical':
          return (a.subreddit || '').localeCompare(b.subreddit || '');
        case 'recent':
        default:
          return 0; // Keep original order
      }
    });
    
    return filtered;
  }, [isCombinedReport, reportData?.subreddit_reports, searchTerm, sortBy]);

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
      report_title, 
      subreddit, 
      analysis_date, 
      // total_subreddits_analyzed: singleReportSubredditCount, // Unused variable 
      executive_summary, 
      key_posts_analysis = [],
      emerging_trends = [],
      sentiment_analysis
    } = reportData;

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
                    {report_title}
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
                      {analysis_date ? format(new Date(analysis_date), 'dd/MM/yyyy') : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {key_posts_analysis.length} bài viết
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => navigate('/reddit-reports-archive')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Xem tất cả
              </button>
              
              <button
                onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 border border-primary-600 hover:bg-primary-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Executive Summary */}
          {executive_summary && (
            <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-xl font-bold mb-4 text-white">
                Tóm tắt chuyên sâu
              </h2>
              <div className="prose prose-lg max-w-none text-gray-300">
                <MarkdownRenderer content={executive_summary} />
              </div>
            </div>
          )}

          {/* Key Posts Analysis */}
          {key_posts_analysis.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-xl font-bold mb-6 text-white">
                Bài viết quan trọng
              </h2>
              
              <div className="space-y-6">
                {key_posts_analysis.map((post, postIndex) => (
                  <div 
                    key={postIndex}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold flex-1 text-white">
                        {post.post_title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm px-2 py-1 rounded-lg"
                              style={{ 
                                background: 'var(--color-primary-500)',
                                color: 'white'
                              }}>
                          {post.upvotes} ↑
                        </span>
                      </div>
                    </div>

                    <div className="mb-3"
                         style={{ color: 'var(--color-neutral-300)' }}>
                      <MarkdownRenderer content={post.analysis} />
                    </div>

                    {post.key_takeaways && post.key_takeaways.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2"
                            style={{ color: 'var(--color-neutral-200)' }}>
                          Điểm chính:
                        </h4>
                        <ul className="list-disc list-inside space-y-1"
                            style={{ color: 'var(--color-neutral-300)' }}>
                          {post.key_takeaways.map((takeaway, index) => (
                            <li key={index}>{takeaway}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {post.post_url && (
                        <a
                          href={post.post_url}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emerging Trends */}
          {emerging_trends.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-xl font-bold mb-6 text-white">
                Xu hướng mới nổi
              </h2>
              
              <div className="space-y-4">
                {emerging_trends.map((trend, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {trend.trend}
                    </h3>
                    <p className="text-gray-300 mb-3">
                      {trend.description}
                    </p>
                    {trend.examples && trend.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Ví dụ:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {trend.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {sentiment_analysis && (
            <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <h2 className="text-xl font-bold mb-6 text-white">
                Phân tích tình cảm
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sentiment_analysis.positive_themes && sentiment_analysis.positive_themes.length > 0 && (
                  <div className="p-4 rounded-xl bg-green-900/20 border border-green-700/30">
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center">
                      😊 Chủ đề tích cực
                    </h4>
                    <ul className="space-y-1">
                      {sentiment_analysis.positive_themes.map((theme, index) => (
                        <li key={index} className="text-sm text-green-400">• {theme}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {sentiment_analysis.negative_themes && sentiment_analysis.negative_themes.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                    <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                      😞 Chủ đề tiêu cực
                    </h4>
                    <ul className="space-y-1">
                      {sentiment_analysis.negative_themes.map((theme, index) => (
                        <li key={index} className="text-sm text-red-400">• {theme}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {sentiment_analysis.neutral_themes && sentiment_analysis.neutral_themes.length > 0 && (
                  <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
                    <h4 className="font-semibold text-gray-300 mb-2 flex items-center">
                      😐 Chủ đề trung lập
                    </h4>
                    <ul className="space-y-1">
                      {sentiment_analysis.neutral_themes.map((theme, index) => (
                        <li key={index} className="text-sm text-gray-400">• {theme}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-12">
          <SocialLinks 
            title={report_title}
            url={window.location.href}
          />
        </div>
      </div>
    );
  }

  // This is a combined report with multiple subreddits
  const { 
    report_title, 
    analysis_date, 
    total_subreddits_analyzed,
    subreddit_reports = [] 
  } = reportData;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 p-6 rounded-2xl backdrop-blur-lg bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        
        {/* Analytics Dashboard */}
        <AnalyticsDashboard reports={processedReports} />
        
        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={setSearchTerm}
          onSortChange={(sort) => setSortBy(sort)}
          totalCount={subreddit_reports.length}
          filteredCount={processedReports.length}
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                 <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-primary">
                  {report_title}
                </h1>
                 <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {analysis_date ? format(new Date(analysis_date), 'dd/MM/yyyy') : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {total_subreddits_analyzed} subreddits
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => navigate('/reddit-reports-archive')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              Xem tất cả
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 border border-primary-600 hover:bg-primary-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
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
          title={report_title}
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