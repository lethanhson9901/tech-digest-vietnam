import React from 'react';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useLatestAINewsReport } from '../hooks/useAINewsReports';

const LatestAINewsReportPage = () => {
  const { report, loading, error } = useLatestAINewsReport();

  return (
    <WeeklyTechReportView
      report={report}
      isLoading={loading}
      error={error}
      contentType="ai-news"
    />
  );
};

export default LatestAINewsReportPage;