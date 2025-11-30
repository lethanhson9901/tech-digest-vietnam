import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CombinedAnalysisView from '../components/CombinedAnalysisView';
import { useCombinedAnalysis } from '../hooks/useContent';

const CombinedAnalysisDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchById } = useCombinedAnalysis();

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id) {
        setError('No analysis ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchById(id);
        setAnalysis(data);
      } catch (err) {
        setError(err.message || 'Failed to load analysis');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id, fetchById]);

  // Handle URL hash for direct section linking
  useEffect(() => {
    if (analysis && location.hash) {
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
  }, [analysis, location.hash]);

  // Set page title
  useEffect(() => {
    if (analysis?.filename) {
      document.title = `${analysis.filename} - Combined Analysis - Tech Digest Vietnam`;
    } else {
      document.title = `Analysis ${id} - Combined Analysis - Tech Digest Vietnam`;
    }

    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [analysis, id]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <CombinedAnalysisView
        analysis={analysis}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default CombinedAnalysisDetailPage;