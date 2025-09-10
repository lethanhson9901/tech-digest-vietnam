import React, { useEffect, useState } from 'react';
import ProductHuntReportView from '../components/ProductHuntReportView';
import { fetchLatestProductHuntReport } from '../services/api';

const LatestProductHuntReportPage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestProductHuntReport = async () => {
      try {
        console.log('Loading latest product hunt report...');
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestProductHuntReport();
        console.log('Latest product hunt report data loaded:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading latest product hunt report:', err);
        setError(err.message || 'Failed to load latest product hunt report');
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestProductHuntReport();
  }, []);

  // Set page title
  useEffect(() => {
    if (report?.filename) {
      document.title = `${report.filename} - Latest Product Hunt Report - Tech Digest Vietnam`;
    } else {
      document.title = 'Latest Product Hunt Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <ProductHuntReportView 
        report={report}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default LatestProductHuntReportPage;
