import React, { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import ErrorMessage from '../components/ErrorMessage';
import ListViewReportsList from '../components/ListViewReportsList';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import TagComponent from '../components/TagComponent';
import { useHackerNewsReports } from '../hooks/useHackerNewsReports';

const HackerNewsReportsArchivePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { reports, totalCount, isLoading, error, fetchReports } = useHackerNewsReports();
  const [params, setParams] = useState({
    skip: 0,
    limit: 10,
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    search: false,
    date: false
  });

  // Load reports
  useEffect(() => {
    fetchReports(params);
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [params, fetchReports, isInitialLoad]);

  // Check if there are active filters
  useEffect(() => {
    setActiveFilters({
      search: !!params.search,
      date: !!(params.dateFrom || params.dateTo)
    });
  }, [params]);

  const handleSearch = (searchTerm) => {
    setParams(prev => ({ ...prev, search: searchTerm, skip: 0 }));
  };

  const handleDateRangeChange = (dateFrom, dateTo) => {
    setParams(prev => ({ ...prev, dateFrom, dateTo, skip: 0 }));
  };

  const clearAllFilters = () => {
    setParams(prev => ({ ...prev, search: '', dateFrom: '', dateTo: '', skip: 0 }));
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HackerNews Reports Archive</h1>
                <p className="text-gray-600 mt-1">Browse and search through all HackerNews reports</p>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} placeholder="Search HackerNews reports..." />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Date Range Picker */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <DateRangePicker
                  dateFrom={params.dateFrom}
                  dateTo={params.dateTo}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && isInitialLoad ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <ListViewReportsList
            reports={reports}
            totalCount={totalCount}
            isLoading={isLoading}
            error={error}
            params={params}
            updateParams={updateParams}
            contentType="hackernews-reports"
          />
        )}
      </div>
    </div>
  );
};

export default HackerNewsReportsArchivePage;
