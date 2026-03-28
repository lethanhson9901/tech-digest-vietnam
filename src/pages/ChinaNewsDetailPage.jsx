import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useChinaNewsReport } from '../hooks/useChinaNewsReport';

const ChinaNewsDetailPage = () => {
  const { id } = useParams();
  const { report, loading, error } = useChinaNewsReport(id);

  return (
    <WeeklyTechReportView
      report={report}
      isLoading={loading}
      error={error}
      contentType="china-news"
    />
  );
};

export default ChinaNewsDetailPage;
