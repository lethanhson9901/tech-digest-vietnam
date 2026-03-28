import { useCallback, useEffect, useState } from 'react';
import { fetchChinaNewsReportById, fetchChinaNewsReports, fetchLatestChinaNews } from '../services/api';

export const useChinaNewsReports = ({
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

  const fetchReports = useCallback(async (options = {}) => {
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
      const data = await fetchChinaNewsReports(params);

      if (options.append) {
        setReports(prev => [...prev, ...data.reports]);
      } else {
        setReports(data.reports);
      }

      setTotal(data.count ?? data.total ?? 0);
      setHasMore(data.reports.length === params.limit);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching China News reports:', err);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, search, dateFrom, dateTo]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchReports({
        skip: reports.length,
        append: true
      });
    }
  }, [loading, hasMore, fetchReports, reports.length]);

  const refresh = useCallback(() => {
    fetchReports({ skip: 0 });
  }, [fetchReports]);

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

export const useLatestChinaNewsReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatest = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLatestChinaNews();
      setReport(data);
    } catch (err) {
      setError(err.message);
      setReport(null);
      console.error('Error fetching latest China News report:', err);
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
    refresh: fetchLatest,
  };
};

export const useChinaNewsReport = (id) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (reportId) => {
    if (!reportId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchChinaNewsReportById(reportId);
      setReport(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching China News report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  const refresh = () => {
    if (id) {
      fetchReport(id);
    }
  };

  return {
    report,
    loading,
    error,
    refresh
  };
};
