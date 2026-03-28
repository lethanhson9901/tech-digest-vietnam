import React from 'react';
import { useLocation } from 'react-router-dom';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useLatestWeeklyTechReport } from '../hooks/useWeeklyTechReports';

const LatestWeeklyTechReportPage = () => {
  const location = useLocation();
  const noCacheParam = new URLSearchParams(location.search).get('no-cache');
  const shouldBypassCache = noCacheParam !== null && noCacheParam.toLowerCase() !== 'false' && noCacheParam !== '0';
  const { report, loading, error } = useLatestWeeklyTechReport({ noCache: shouldBypassCache });

  return (
    <WeeklyTechReportView 
      report={report} 
      isLoading={loading} 
      error={error} 
    />
  );
};

export default LatestWeeklyTechReportPage;
