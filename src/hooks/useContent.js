import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  fetchReports, 
  fetchJsonReports, 
  fetchCombinedAnalysis,
  fetchLatestReport,
  fetchLatestJsonReport,
  fetchLatestCombinedAnalysis,
  fetchReportById,
  fetchJsonReportById,
  fetchCombinedAnalysisById
} from '../services/api';

// Generic hook for handling different content types
export const useContent = (contentType, initialParams = {}) => {
  const [content, setContent] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    skip: 0,
    limit: 10,
    search: '',
    dateFrom: '',
    dateTo: '',
    ...initialParams
  });

  // Map content types to their respective API functions
  const apiFunctions = useMemo(() => ({
    reports: {
      fetchList: fetchReports,
      fetchLatest: fetchLatestReport,
      fetchById: fetchReportById
    },
    'json-reports': {
      fetchList: fetchJsonReports,
      fetchLatest: fetchLatestJsonReport,
      fetchById: fetchJsonReportById
    },
    'combined-analysis': {
      fetchList: fetchCombinedAnalysis,
      fetchLatest: fetchLatestCombinedAnalysis,
      fetchById: fetchCombinedAnalysisById
    }
  }), []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiFunc = apiFunctions[contentType]?.fetchList;
        if (!apiFunc) {
          throw new Error(`Unknown content type: ${contentType}`);
        }
        
        const data = await apiFunc(params);
        setContent(data.reports || []); // API returns 'reports' field for all types
        setTotalCount(data.count || 0);
      } catch (err) {
        setError(err.message);
        setContent([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [params, contentType]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Helper functions for fetching single items
  const fetchLatest = useCallback(async () => {
    const apiFunc = apiFunctions[contentType]?.fetchLatest;
    if (!apiFunc) {
      throw new Error(`Unknown content type: ${contentType}`);
    }
    return await apiFunc();
  }, [contentType, apiFunctions]);

  const fetchById = useCallback(async (id) => {
    const apiFunc = apiFunctions[contentType]?.fetchById;
    if (!apiFunc) {
      throw new Error(`Unknown content type: ${contentType}`);
    }
    return await apiFunc(id);
  }, [contentType, apiFunctions]);

  return {
    content,
    totalCount,
    isLoading,
    error,
    params,
    updateParams,
    fetchLatest,
    fetchById
  };
};

// Specific hooks for backward compatibility and convenience
export const useReports = (initialParams = {}) => {
  const result = useContent('reports', initialParams);
  return {
    ...result,
    reports: result.content // Alias for backward compatibility
  };
};

export const useJsonReports = (initialParams = {}) => {
  const result = useContent('json-reports', initialParams);
  return {
    ...result,
    reports: result.content // Keep consistent naming
  };
};

export const useCombinedAnalysis = (initialParams = {}) => {
  const result = useContent('combined-analysis', initialParams);
  return {
    ...result,
    reports: result.content // Keep consistent naming for UI components
  };
}; 