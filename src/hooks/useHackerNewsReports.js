import { useCallback, useState } from 'react';
import { fetchHackerNewsReports, fetchHackerNewsReportById } from '../services/api';

export const useHackerNewsReports = () => {
  const [reports, setReports] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchHackerNewsReports(params);
      setReports(data.reports || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hackernews reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchHackerNewsReportById(id);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hackernews report by ID:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reports,
    totalCount,
    isLoading,
    error,
    fetchReports,
    fetchById
  };
};
