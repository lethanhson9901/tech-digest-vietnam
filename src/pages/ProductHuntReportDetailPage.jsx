import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductHuntReportView from '../components/ProductHuntReportView';
import { useProductHuntReport } from '../hooks/useProductHuntReport';

const ProductHuntReportDetailPage = () => {
  const { id } = useParams();
  const { report, loading, error } = useProductHuntReport(id);

  // Set page title based on report
  useEffect(() => {
    if (report?.filename) {
      document.title = `${report.filename} - Product Hunt Report - Tech Digest Vietnam`;
    } else {
      document.title = 'Product Hunt Report - Tech Digest Vietnam';
    }
    
    return () => {
      document.title = 'Tech Digest Vietnam';
    };
  }, [report]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <ProductHuntReportView 
        report={report}
        isLoading={loading}
        error={error}
      />
    </div>
  );
};

export default ProductHuntReportDetailPage;
