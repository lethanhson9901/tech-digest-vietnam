import { useState, useEffect } from 'react';
import { fetchWeeklyTechReportById } from '../services/api';

export const useWeeklyTechReport = (id) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (reportId) => {
    if (!reportId) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeeklyTechReportById(reportId);
      setReport(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Weekly Tech report:', err);
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
