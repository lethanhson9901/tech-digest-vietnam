import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CombinedAnalysisView from '../components/CombinedAnalysisView';
import { useCombinedAnalysis } from '../hooks/useContent';

const CombinedAnalysisDetailPage = () => {
  const { id } = useParams();
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
        console.log('Loading analysis with ID:', id);
        setIsLoading(true);
        setError(null);
        const data = await fetchById(id);
        console.log('Analysis data loaded:', data);
        setAnalysis(data);
      } catch (err) {
        console.error('Error loading analysis:', err);
        setError(err.message || 'Failed to load analysis');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id, fetchById]);

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
    <div className="min-h-screen bg-gray-50">
      <CombinedAnalysisView 
        analysis={analysis}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default CombinedAnalysisDetailPage; 