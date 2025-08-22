import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import SocialLinks from './SocialLinks';
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

// Lazy Loaded Article Card Component
const LazyArticleCard = ({ article, index, onViewDetail }) => {
  const [elementRef, , hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  if (!hasIntersected) {
    return (
      <div ref={elementRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[200px] animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-700/30 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-orange-300 dark:hover:border-orange-600">
      {/* Article Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
            {article.headline}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-amber-800/15 dark:to-yellow-800/15 rounded-xl">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-300 dark:bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-orange-700 dark:text-amber-100">{article.points} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-300 dark:bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-semibold text-orange-700 dark:text-amber-100">{article.numComments} comments</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.slice(0, 3).map((tag, tagIndex) => (
            <TagComponent key={tagIndex} tag={tag} />
          ))}
          {article.tags.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-orange-200 dark:border-orange-700/30">
        <div className="flex items-center space-x-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-300 dark:bg-amber-600 hover:bg-orange-400 dark:hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Source
          </a>
          <a
            href={article.hnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-300 dark:bg-amber-600 hover:bg-orange-400 dark:hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            HN
          </a>
        </div>
        
        <button
          onClick={() => onViewDetail(article)}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-300 to-yellow-400 dark:from-amber-600 dark:to-yellow-500 hover:from-orange-400 hover:to-yellow-500 dark:hover:from-amber-500 dark:hover:to-yellow-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Chi tiết
        </button>
      </div>
    </div>
  );
};

// Article Detail Modal
const ArticleDetailModal = ({ isOpen, onClose, articleData }) => {
  if (!isOpen || !articleData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-amber-800/15 dark:to-yellow-800/15 px-6 py-4 border-b border-orange-200/30 dark:border-amber-600/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-300 dark:bg-amber-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-700 dark:text-amber-100 line-clamp-2">
                  {articleData.headline}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-orange-400 hover:text-orange-600 dark:hover:text-amber-300 hover:bg-orange-100 dark:hover:bg-amber-700/30 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 px-6 py-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tóm tắt
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{articleData.summary}</p>
              </div>

              {/* Key Takeaways */}
              {articleData.keyTakeaways && articleData.keyTakeaways.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Điểm chính
                  </h4>
                  <ul className="space-y-3">
                    {articleData.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-slate-700 dark:text-slate-300 text-lg">{takeaway}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Community Insights */}
              {articleData.communityInsights && articleData.communityInsights.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Thảo luận cộng đồng
                  </h4>
                  <div className="space-y-4">
                    {articleData.communityInsights.map((insight, index) => (
                      <div key={index} className="bg-white dark:bg-slate-600 p-4 rounded-lg border border-slate-200 dark:border-slate-500">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-500 px-3 py-1 rounded-full">
                            {insight.author}
                          </span>
                        </div>
                        <blockquote className="text-slate-700 dark:text-slate-300 italic mb-3 text-lg border-l-4 border-slate-400 pl-4">
                          "{insight.quote}"
                        </blockquote>
                        <p className="text-slate-600 dark:text-slate-400">{insight.analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Discussions */}
              {articleData.technicalDiscussions && articleData.technicalDiscussions.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Thảo luận kỹ thuật
                  </h4>
                  <div className="space-y-4">
                    {articleData.technicalDiscussions.map((discussion, index) => (
                      <div key={index} className="bg-white dark:bg-slate-600 p-4 rounded-lg border border-slate-200 dark:border-slate-500">
                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-lg">
                          {discussion.topic}
                        </h5>
                        {discussion.viewpoints && discussion.viewpoints.length > 0 && (
                          <div className="space-y-3">
                            {discussion.viewpoints.map((viewpoint, vIndex) => (
                              <div key={vIndex} className="border-l-4 border-slate-400 pl-4">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                  {viewpoint.perspective}
                                </p>
                                {viewpoint.pros && (
                                  <p className="text-sm text-green-700 dark:text-green-400 mb-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                    <strong>Ưu điểm:</strong> {viewpoint.pros}
                                  </p>
                                )}
                                {viewpoint.cons && (
                                  <p className="text-sm text-red-700 dark:text-red-400 mb-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                    <strong>Nhược điểm:</strong> {viewpoint.cons}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {discussion.conclusion && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>Kết luận:</strong> {discussion.conclusion}
                            </p>
                          </div>
                        )}
                        {discussion.lessons && (
                          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-purple-800 dark:text-purple-300">
                              <strong>Bài học:</strong> {discussion.lessons}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">{articleData.points} points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">{articleData.numComments} comments</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <a
                    href={articleData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-orange-300 dark:bg-amber-600 hover:bg-orange-400 dark:hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Source
                  </a>
                  <a
                    href={articleData.hnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-orange-300 dark:bg-amber-600 hover:bg-orange-400 dark:hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    View on HN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HackerNewsReportView = ({ report, isLoading, error }) => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Parse the content if it's a string
  let reportData = report;
  if (typeof report?.content === 'string') {
    try {
      reportData = JSON.parse(report.content);
    } catch (e) {
      console.error('Error parsing hackernews report content:', e);
      reportData = null;
    }
  }

  // Filter and process articles with search and sort
  const processedSections = useMemo(() => {
    if (!reportData?.sections) return [];

    return reportData.sections.map(section => {
      let filteredArticles = section.articles || [];
      
      // Apply search filter
      if (searchTerm) {
        filteredArticles = filteredArticles.filter(article =>
          article.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply sorting
      filteredArticles = [...filteredArticles].sort((a, b) => {
        switch (sortBy) {
          case 'points':
            return b.points - a.points;
          case 'comments':
            return b.numComments - a.numComments;
          case 'recent':
          default:
            return 0; // Keep original order
        }
      });

      return {
        ...section,
        articles: filteredArticles
      };
    }).filter(section => section.articles.length > 0);
  }, [reportData?.sections, searchTerm, sortBy]);

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
    return <ErrorMessage message="Không tìm thấy báo cáo" />;
  }

  const { 
    reportTitle, 
    analysisDate, 
    totalStories, 
    executiveSummary, 
    trendingTopics = [],
    communityMood,
    technicalTrends = []
  } = reportData;



  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 dark:from-amber-800 dark:via-orange-700 dark:to-orange-600 p-8 lg:p-12 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-4 dark:opacity-3">
          <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 dark:bg-amber-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-orange-300/30 dark:bg-amber-600/50 backdrop-blur-sm shadow-lg">
                  <svg className="w-8 h-8 text-orange-600 dark:text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-white leading-tight">
                    {reportTitle || 'Tin nổi bật HackerNews'}
                  </h1>
                  <div className="flex items-center space-x-6 text-white/90">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{analysisDate && format(new Date(analysisDate), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span className="font-medium">{totalStories} bài viết</span>
                    </div>
                  </div>
                </div>
              </div>

              {executiveSummary && (
                <div className="mb-6 p-6 bg-orange-200/20 dark:bg-amber-700/20 backdrop-blur-sm rounded-2xl border border-orange-200/30 dark:border-amber-600/30">
                  <h2 className="text-xl font-semibold text-orange-800 dark:text-amber-100 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tóm tắt
                  </h2>
                  <p className="text-orange-700 dark:text-amber-200 leading-relaxed text-lg">{executiveSummary}</p>
                </div>
              )}

              {/* Enhanced Search and Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 focus:bg-white text-gray-900 placeholder-gray-500 shadow-lg"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 focus:bg-white text-gray-900 shadow-lg"
                >
                  <option value="recent">Mới nhất</option>
                  <option value="points">Điểm cao nhất</option>
                  <option value="comments">Nhiều bình luận nhất</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6 lg:mt-0">
              <button
                onClick={() => navigate('/hackernews-reports-archive')}
                className="inline-flex items-center px-6 py-3 bg-orange-200/40 dark:bg-amber-700/40 backdrop-blur-sm hover:bg-orange-200/60 dark:hover:bg-amber-700/60 text-orange-800 dark:text-amber-100 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg border border-orange-200/40 dark:border-amber-600/40"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Xem tất cả
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-700/80 text-orange-700 dark:text-amber-200 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg border border-orange-200/30 dark:border-amber-600/30"
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
      </div>

      {/* Enhanced Trending Topics and Community Mood */}
      {(trendingTopics.length > 0 || communityMood || technicalTrends.length > 0) && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trendingTopics.length > 0 && (
            <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-amber-800/15 dark:to-yellow-800/15 rounded-2xl p-8 shadow-lg border border-orange-200/30 dark:border-amber-600/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-300 dark:bg-amber-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c1.1 0 2 .9 2 2v5.293l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L13 10.293V5c0-1.1-.9-2-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-700 dark:text-amber-100">Chủ đề nổi bật</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {trendingTopics.map((topic, index) => (
                  <TagComponent key={index} tag={topic} />
                ))}
              </div>
            </div>
          )}

          {communityMood && (
            <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-amber-800/15 dark:to-yellow-800/15 rounded-2xl p-8 shadow-lg border border-orange-200/30 dark:border-amber-600/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-300 dark:bg-amber-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-700 dark:text-amber-100">Tâm trạng cộng đồng</h3>
              </div>
              <p className="text-orange-600 dark:text-amber-200 text-lg leading-relaxed">{communityMood}</p>
            </div>
          )}

          {technicalTrends.length > 0 && (
            <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-amber-800/15 dark:to-yellow-800/15 rounded-2xl p-8 shadow-lg border border-orange-200/30 dark:border-amber-600/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-300 dark:bg-amber-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-700 dark:text-amber-100">Xu hướng kỹ thuật</h3>
              </div>
              <div className="space-y-3">
                {technicalTrends.map((trend, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-300 dark:bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-orange-600 dark:text-amber-200 text-lg">{trend}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Sections */}
      <div className="space-y-16">
        {processedSections.map((section, sectionIndex) => (
          <div key={sectionIndex} id={`section-${sectionIndex}`} className="scroll-mt-20">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-yellow-400 dark:from-amber-600 dark:to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-orange-700 dark:text-amber-100">
                  {section.title}
                </h2>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-300 to-yellow-400 dark:from-amber-600 dark:to-yellow-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {section.articles.map((article, articleIndex) => (
                <LazyArticleCard
                  key={articleIndex}
                  article={article}
                  index={articleIndex}
                  onViewDetail={(data) => {
                    setSelectedArticle(data);
                    setIsDetailModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="mt-12">
        <SocialLinks 
          title={reportTitle}
          url={window.location.href}
        />
      </div>

      {/* Detail Modal */}
      <ArticleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedArticle(null);
        }}
        articleData={selectedArticle}
      />
    </div>
  );
};

export default HackerNewsReportView;