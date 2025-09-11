import { format } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';

const WeeklyTechReportView = ({ report, isLoading, error }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="large" 
          text="Đang tải Tạp chí Công nghệ..." 
          showText
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Không tìm thấy báo cáo</h2>
          <p className="text-gray-500 mt-2">Báo cáo này có thể đã bị xóa hoặc không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Quay lại</span>
            </button>
            <SocialLinks />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 animate-slideIn">
              {report.filename || 'Tạp chí Công nghệ hằng tuần'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 animate-slideIn" style={{ animationDelay: '0.1s' }}>
              <span>📅 {formatDate(report.upload_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg">
          <MarkdownRenderer content={report.content} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyTechReportView;
