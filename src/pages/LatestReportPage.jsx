// src/pages/LatestReportPage.jsx
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { fetchLatestReport } from '../services/api';

const LatestReportPage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

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
    return <ErrorMessage message="Latest report not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">Latest Tech Digest</h1>
            {report.upload_date && (
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
                {format(new Date(report.upload_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <p className="text-indigo-100 mt-2">{report.filename}</p>
        </div>
        
        <div className="p-6">
          <MarkdownRenderer content={report.content} />
        </div>
      </div>
    </div>
  );
};

export default LatestReportPage;
