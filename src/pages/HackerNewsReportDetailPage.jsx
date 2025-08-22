import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HackerNewsReportView from '../components/HackerNewsReportView';
import { useHackerNewsReports } from '../hooks/useHackerNewsReports';

const HackerNewsReportDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchById } = useHackerNewsReports();

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        setError('No report ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Loading hackernews report with ID:', id);
        setIsLoading(true);
        setError(null);
        const data = await fetchById(id);
        console.log('HackerNews report data loaded:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading hackernews report:', err);
        setError(err.message || 'Failed to load hackernews report');
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
      document.title = `${report.filename} - HackerNews Report - Tech Digest Vietnam`;
    } else {
      document.title = 'HackerNews Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen">
      <HackerNewsReportView 
        report={report}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default HackerNewsReportDetailPage;
