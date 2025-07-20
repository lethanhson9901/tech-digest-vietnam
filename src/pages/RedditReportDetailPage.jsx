import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RedditReportView from '../components/RedditReportView';
import { useRedditReports } from '../hooks/useRedditReports';

const RedditReportDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchById } = useRedditReports();

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        setError('No report ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Loading reddit report with ID:', id);
        setIsLoading(true);
        setError(null);
        const data = await fetchById(id);
        console.log('Reddit report data loaded:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading reddit report:', err);
        setError(err.message || 'Failed to load reddit report');
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [id, fetchById]);

  // Handle URL hash for direct section linking
  useEffect(() => {
    if (report && location.hash) {
      const targetId = location.hash.substring(1); // Remove the # symbol
      const timeout = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const yOffset = -80; // Offset for header
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 500); // Wait for content to render

      return () => clearTimeout(timeout);
    }
  }, [report, location.hash]);

  // Set page title
  useEffect(() => {
    if (report?.filename) {
      document.title = `${report.filename} - Reddit Report - Tech Digest Vietnam`;
    } else {
      document.title = 'Reddit Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen">
      <RedditReportView 
        report={report}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default RedditReportDetailPage; 