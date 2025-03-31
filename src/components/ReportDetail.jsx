import { format } from 'date-fns';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

const ReportDetail = () => {
  const { id } = useParams();
  const { report, isLoading, error } = useReport(id);
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

  if (!report) {
    return <ErrorMessage message="Report not found" />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white hover:text-indigo-100 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <div className="text-white text-sm">
            {report.upload_date && (
              <time dateTime={report.upload_date}>
                {format(new Date(report.upload_date), 'MMM d, yyyy')}
              </time>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mt-2">{report.filename}</h1>
      </div>
      
      <div className="p-6">
        <div className="prose prose-indigo max-w-none">
          {/* Apply styling to the content based on its format (Markdown, plain text, etc.) */}
          <div className="whitespace-pre-wrap">{report.content}</div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;