import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useWeeklyTechReport } from '../hooks/useWeeklyTechReport';

const WeeklyTechReportDetailPage = () => {
  const { id } = useParams();
  const { report, loading, error } = useWeeklyTechReport(id);

  return (
    <WeeklyTechReportView 
      report={report} 
      isLoading={loading} 
      error={error} 
    />
  );
};

export default WeeklyTechReportDetailPage;
