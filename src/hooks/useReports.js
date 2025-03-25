import { useEffect, useState } from 'react';
import { fetchReports } from '../services/api';

export const useReports = (initialParams = {}) => {
  const [reports, setReports] = useState([]);
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

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchReports(params);
        setReports(data.reports);
        setTotalCount(data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [params]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    reports,
    totalCount,
    isLoading,
    error,
    params,
    updateParams
  };
};