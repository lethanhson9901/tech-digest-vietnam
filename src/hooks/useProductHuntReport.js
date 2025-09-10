import { useState, useEffect } from 'react';
import { fetchProductHuntReportById } from '../services/api';

export const useProductHuntReport = (id) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (reportId) => {
    if (!reportId) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProductHuntReportById(reportId);
      setReport(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Product Hunt report:', err);
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
