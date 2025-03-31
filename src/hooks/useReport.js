import { useEffect, useState } from 'react';
import { fetchLatestReport, fetchReportById } from '../services/api';

export const useReport = (id = null) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let data;
        if (id) {
          data = await fetchReportById(id);
        } else {
          data = await fetchLatestReport();
        }
        
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [id]);

  return { report, isLoading, error };
};