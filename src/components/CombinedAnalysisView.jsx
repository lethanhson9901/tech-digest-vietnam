import { format } from 'date-fns';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';
import TableOfContents from './TableOfContents';

const CombinedAnalysisView = ({ analysis, isLoading, error }) => {
  const navigate = useNavigate();
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

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

  if (!analysis) {
    return <ErrorMessage message="Combined Analysis not found" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
      {/* Mobile Sticky TOC Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-md">
        <div className="flex items-center justify-between p-3">
          <button 
            onClick={() => navigate(-1)} 
            className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          
          <button
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Mục Lục</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform duration-200 ${isMobileTocOpen ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Mobile TOC Dropdown */}
        <div className={`absolute left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden bg-white/98 backdrop-blur-md shadow-lg ${
          isMobileTocOpen ? 'max-h-[70vh] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="p-4 bg-gradient-to-b from-emerald-50 to-white rounded-b-3xl">
            <TableOfContents 
              content={analysis.content} 
              isMobile={true}
              onItemClick={() => setIsMobileTocOpen(false)}
            />
            
            {/* Mobile Social Links */}
            <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-center space-x-4">
              <span className="text-xs text-secondary font-medium">Kết nối:</span>
              <SocialLinks compact className="flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden lg:block mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      
      <div className="flex gap-6">
        {/* Table of Contents - Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <TableOfContents content={analysis.content} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Combined Analysis</h1>
            </div>
            {analysis.upload_date && (
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
                {format(new Date(analysis.upload_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <p className="text-emerald-100 mt-2">{analysis.filename}</p>
        </div>
        
        <div className="p-6">
          <MarkdownRenderer content={analysis.content} />
            </div>
            
            {/* Footer with Social Links */}
            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-emerald-50 px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-primary mb-2">Tech Digest Vietnam</h3>
                  <p className="text-sm text-secondary max-w-md">
                    Phân tích chuyên sâu các xu hướng công nghệ mới nhất, 
                    giúp bạn nắm bắt cơ hội trong thời đại số.
                  </p>
                </div>
                
                <div className="flex flex-col items-center md:items-end space-y-4">
                  <SocialLinks />
                  <div className="text-xs text-muted text-center md:text-right">
                    © 2025 Tech Digest Vietnam. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedAnalysisView; 