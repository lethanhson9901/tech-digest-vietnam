import { useCallback, useEffect, useState } from 'react';
import { fetchRedditReports, fetchRedditReportById } from '../services/api';

export const useRedditReports = () => {
  const [reports, setReports] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRedditReports(params);
      setReports(data.reports || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reddit reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRedditReportById(id);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reddit report by ID:', err);
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