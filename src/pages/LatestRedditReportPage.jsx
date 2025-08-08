import React, { useEffect, useState } from 'react';
import RedditReportView from '../components/RedditReportView';
import { fetchLatestRedditReport } from '../services/api';

const LatestRedditReportPage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestRedditReport = async () => {
      try {
        console.log('Loading latest reddit report...');
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestRedditReport();
        console.log('Latest reddit report data loaded:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading latest reddit report:', err);
        setError(err.message || 'Failed to load latest reddit report');
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestRedditReport();
  }, []);

  // Set page title
  useEffect(() => {
    if (report?.filename) {
      document.title = `${report.filename} - Latest Reddit Report - Tech Digest Vietnam`;
    } else {
      document.title = 'Latest Reddit Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <RedditReportView 
        report={report}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default LatestRedditReportPage; 