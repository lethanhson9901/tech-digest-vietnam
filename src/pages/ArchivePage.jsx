// src/pages/ArchivePage.jsx (enhanced version)
import React, { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import ErrorMessage from '../components/ErrorMessage';
import ListViewReportsList from '../components/ListViewReportsList';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { useReports } from '../hooks/useReports';

const ArchivePage = () => {
  const { reports, totalCount, isLoading, error, params, updateParams } = useReports();
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    search: false,
    date: false
  });

  // Check if there are active filters
  useEffect(() => {
    setActiveFilters({
      search: !!params.search,
      date: !!(params.dateFrom || params.dateTo)
    });
    
    if (isInitialLoad && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [params, isLoading]);

  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm, skip: 0 });
  };

  const handleDateRangeChange = (dateFrom, dateTo) => {
    updateParams({ dateFrom, dateTo, skip: 0 });
  };

  const clearAllFilters = () => {
    updateParams({ search: '', dateFrom: '', dateTo: '', skip: 0 });
  };

  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">Tech Digest Archive</h1>
            <div className="flex items-center mt-2 md:mt-0 space-x-2">
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm inline-flex items-center hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 text-white px-3 py-1 rounded-full text-sm inline-flex items-center hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-white text-indigo-600 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <p className="text-indigo-100 mt-2">Browse all technical reports</p>
          
          {/* Active filter pills */}
          {(activeFilters.search || activeFilters.date) && (
            <div className="flex flex-wrap mt-3 gap-2">
              {activeFilters.search && (
                <div className="bg-white/10 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  <span className="mr-1">Search: {params.search}</span>
                  <button 
                    onClick={() => updateParams({ search: '', skip: 0 })}
                    className="ml-1 hover:text-indigo-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              {activeFilters.date && (
                <div className="bg-white/10 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  <span className="mr-1">
                    Date: {params.dateFrom ? new Date(params.dateFrom).toLocaleDateString() : 'Any'} to {params.dateTo ? new Date(params.dateTo).toLocaleDateString() : 'Any'}
                  </span>
                  <button 
                    onClick={() => updateParams({ dateFrom: '', dateTo: '', skip: 0 })}
                    className="ml-1 hover:text-indigo-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialValue={params.search} />
          </div>
          
          {/* Filters section with animation */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>
          
          {/* Loading state for initial load */}
          {isInitialLoad ? (
            <div className="flex justify-center items-center min-h-[40vh]">
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
