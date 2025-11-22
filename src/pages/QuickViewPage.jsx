// src/pages/QuickViewPage.jsx
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { fetchLatestQuickView } from '../services/api';

const QuickViewPage = () => {
  const [quickView, setQuickView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestQuickView = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestQuickView();
        setQuickView(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestQuickView();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!quickView) {
    return <ErrorMessage message="Quick view report not found" />;
  }

  // Parse the content from JSON string to object
  let parsedContent = null;
  try {
    if (typeof quickView.content === 'string') {
      parsedContent = JSON.parse(quickView.content);
    } else {
      parsedContent = quickView.content;
    }
  } catch (e) {
    console.error('Error parsing content:', e);
    return <ErrorMessage message="Failed to parse quick view content" />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">Quick View</h1>
            {quickView.upload_date && (
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm mt-2 md:mt-0 inline-block">
                {format(new Date(quickView.upload_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <p className="text-blue-100 mt-2">{quickView.filename}</p>
        </div>

        <div className="p-6">
          {parsedContent && parsedContent.groups && Array.isArray(parsedContent.groups) && (
            <div className="space-y-8">
              {parsedContent.groups.map((group, index) => (
                <div key={index} className="border border-neutral-200 dark:border-[#1f2937] rounded-lg p-6 bg-gray-50 dark:bg-[#0f172a]">
                  <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-dark-accent-primary-bg border-b pb-2">
                    {group.title}
                  </h2>
                  <MarkdownRenderer content={group.short_summary} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickViewPage;