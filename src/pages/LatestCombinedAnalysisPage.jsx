import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CombinedAnalysisView from '../components/CombinedAnalysisView';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchLatestCombinedAnalysis } from '../services/api';

const LatestCombinedAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLatestAnalysis = async () => {
      try {
        console.log('Loading latest combined analysis...');
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestCombinedAnalysis();
        console.log('Latest analysis data loaded:', data);
        setAnalysis(data);
      } catch (err) {
        console.error('Error loading latest analysis:', err);
        setError(err.message || 'Failed to load latest analysis');
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestAnalysis();
  }, []);

  // Set page title
  useEffect(() => {
    if (analysis?.filename) {
      document.title = `${analysis.filename} - Latest Analysis - Tech Digest Vietnam`;
    } else {
      document.title = 'Latest Analysis - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [analysis]);

  // Loading state with enhanced animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center">
        <div className="text-center space-y-6">
          <LoadingSpinner 
            type="tech" 
            size="large" 
            color="emerald"
            showText
            text="Đang tải phân tích mới nhất..."
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary animate-pulse">
              🚀 Đang chuẩn bị phân tích tổng hợp
            </h2>
            <p className="text-secondary max-w-md">
              Chúng tôi đang tổng hợp những insights công nghệ mới nhất cho bạn...
            </p>
          </div>
          
          {/* Progress Animation */}
            <div className="w-80 bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-primary mb-4">
              Không thể tải phân tích mới nhất
            </h2>
            <p className="text-secondary mb-6">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại
              </button>
              
              <button
                onClick={() => navigate('/combined-analysis')}
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-base font-medium rounded-lg text-secondary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Xem tất cả phân tích
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the analysis
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">📊 Phân tích tổng hợp mới nhất</h1>
                <p className="text-emerald-100">Insights công nghệ được cập nhật gần nhất</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => navigate('/combined-analysis')}
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Tất cả phân tích
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                title="Làm mới để lấy phân tích mới nhất"
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
      
      <CombinedAnalysisView 
        analysis={analysis}
        isLoading={false}
        error={null}
      />
    </div>
  );
};

export default LatestCombinedAnalysisPage; 