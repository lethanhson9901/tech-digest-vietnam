import React from 'react';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useLatestChinaNewsReport } from '../hooks/useChinaNewsReport';

const ChinaNewsPage = () => {
  const { report, loading, error } = useLatestChinaNewsReport();

  return (
    <WeeklyTechReportView
      report={report}
      isLoading={loading}
      error={error}
      contentType="china-news"
    />
  );
};

export default ChinaNewsPage;
