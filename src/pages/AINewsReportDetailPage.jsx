import React from 'react';
import { useParams } from 'react-router-dom';
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useAINewsReport } from '../hooks/useAINewsReport';

const AINewsReportDetailPage = () => {
  const { id } = useParams();
  const { report, loading, error } = useAINewsReport(id);

  return (
    <WeeklyTechReportView
      report={report}
      isLoading={loading}
      error={error}
      contentType="ai-news"
    />
  );
};

export default AINewsReportDetailPage;