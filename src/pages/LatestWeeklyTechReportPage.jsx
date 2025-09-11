import React from 'react';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useLatestWeeklyTechReport } from '../hooks/useWeeklyTechReports';

const LatestWeeklyTechReportPage = () => {
  const { report, loading, error } = useLatestWeeklyTechReport();

  return (
    <WeeklyTechReportView 
      report={report} 
      isLoading={loading} 
      error={error} 
    />
  );
};

export default LatestWeeklyTechReportPage;
