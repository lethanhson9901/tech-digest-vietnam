import { useEffect, useState } from 'react';
import { fetchLatestChinaNews } from '../services/api';

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
