import { useState, useEffect } from 'react';
import { fetchProductHuntReports, fetchLatestProductHuntReport } from '../services/api';

export const useProductHuntReports = ({ 
  skip = 0, 
  limit = 10, 
  search = '', 
  dateFrom = '', 
  dateTo = '', 
  autoFetch = true 
} = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = async (options = {}) => {
    const params = {
      skip: options.skip ?? skip,
      limit: options.limit ?? limit,
      search: options.search ?? search,
      dateFrom: options.dateFrom ?? dateFrom,
      dateTo: options.dateTo ?? dateTo
    };

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProductHuntReports(params);
      
      if (options.append) {
        setReports(prev => [...prev, ...data.reports]);
      } else {
        setReports(data.reports);
      }
      
      setTotal(data.total);
      setHasMore(data.reports.length === params.limit);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Product Hunt reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchReports({ 
        skip: reports.length,
        append: true 
      });
    }
  };

  const refresh = () => {
    fetchReports({ skip: 0 });
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReports();
    }
  }, [skip, limit, search, dateFrom, dateTo, autoFetch]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    reports,
    loading,
    error,
    total,
    hasMore,
    fetchReports,
    loadMore,
    refresh
  };
};

export const useLatestProductHuntReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatest = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLatestProductHuntReport();
      setReport(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching latest Product Hunt report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  return {
    report,
    loading,
    error,
    refresh: fetchLatest
  };
};
