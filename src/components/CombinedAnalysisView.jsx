import { format } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

const CombinedAnalysisView = ({ analysis, isLoading, error }) => {
  const navigate = useNavigate();

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
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
      </div>
    </div>
  );
};

export default CombinedAnalysisView; 