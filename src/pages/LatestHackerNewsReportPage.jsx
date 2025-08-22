import React, { useEffect, useState } from 'react';
import HackerNewsReportView from '../components/HackerNewsReportView';
import { fetchLatestHackerNewsReport } from '../services/api';

const LatestHackerNewsReportPage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestHackerNewsReport = async () => {
      try {
        console.log('Loading latest hackernews report...');
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestHackerNewsReport();
        console.log('Latest hackernews report data loaded:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading latest hackernews report:', err);
        setError(err.message || 'Failed to load latest hackernews report');
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestHackerNewsReport();
  }, []);

  // Set page title
  useEffect(() => {
    if (report?.filename) {
      document.title = `${report.filename} - Latest HackerNews Report - Tech Digest Vietnam`;
    } else {
      document.title = 'Latest HackerNews Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <HackerNewsReportView 
        report={report}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default LatestHackerNewsReportPage;
