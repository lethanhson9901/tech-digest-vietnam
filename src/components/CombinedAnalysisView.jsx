import { format } from 'date-fns';
import React from 'react';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

const CombinedAnalysisView = ({ analysis, isLoading, error }) => {
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">Combined Analysis</h1>
            {analysis.upload_date && (
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
                {format(new Date(analysis.upload_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <p className="text-indigo-100 mt-2">{analysis.filename}</p>
        </div>

        <div className="p-6">
          <MarkdownRenderer content={analysis.content} autoTOC={true} />
        </div>
      </div>
    </div>
  );
};

export default CombinedAnalysisView;