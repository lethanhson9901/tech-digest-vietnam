// src/pages/ArchivePage.jsx (enhanced version)
import React, { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import ErrorMessage from '../components/ErrorMessage';
import ListViewReportsList from '../components/ListViewReportsList';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import TagComponent from '../components/TagComponent';
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

  const removeSearchFilter = () => {
    updateParams({ search: '', skip: 0 });
  };

  const removeDateFilter = () => {
    updateParams({ dateFrom: '', dateTo: '', skip: 0 });
  };

  // Count total active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-4 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white animate-slideIn">
                Tech Digest Archive
              </h1>
              <p className="text-indigo-100 mt-2 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                Browse {totalCount || 'all'} technical reports with advanced filtering
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-3 animate-slideIn" style={{ animationDelay: '0.2s' }}>
              {activeFilterCount > 0 && (
                <TagComponent
                  variant="warning"
                  size="small"
                  closable
                  onClose={clearAllFilters}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Clear All ({activeFilterCount})
                </TagComponent>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 text-white px-4 py-2 rounded-full text-sm inline-flex items-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-white text-indigo-600 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold animate-pulse-glow">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Active filter tags with enhanced styling */}
          {(activeFilters.search || activeFilters.date) && (
            <div className="relative z-10 flex flex-wrap mt-4 gap-3 animate-fadeIn">
              <div className="text-white text-sm font-medium mb-2 w-full">Active Filters:</div>
              {activeFilters.search && (
                <TagComponent
                  variant="info"
                  size="small"
                  closable
                  onClose={removeSearchFilter}
                  className="bg-white/15 text-white border-white/30 hover:bg-white/25"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search: "{params.search}"
                </TagComponent>
              )}
              {activeFilters.date && (
                <TagComponent
                  variant="success"
                  size="small"
                  closable
                  onClose={removeDateFilter}
                  className="bg-white/15 text-white border-white/30 hover:bg-white/25"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date: {params.dateFrom ? new Date(params.dateFrom).toLocaleDateString() : 'Any'} to {params.dateTo ? new Date(params.dateTo).toLocaleDateString() : 'Any'}
                </TagComponent>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              searchValue={params.search}
              onClear={() => updateParams({ search: '', skip: 0 })}
            />
          </div>
          
          {/* Filters section with enhanced animation */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100 mb-6 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
          }`}>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Date Range Filter
              </h3>
              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>
          </div>
          
          {/* Loading state for initial load with enhanced spinner */}
          {isInitialLoad ? (
            <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
              <LoadingSpinner 
                type="tech" 
                size="large" 
                color="indigo"
                showText
                text="Loading tech reports..."
              />
              <div className="text-gray-500 text-sm">
                Fetching the latest technology insights...
              </div>
            </div>
          ) : error ? (
            <div className="animate-fadeIn">
              <ErrorMessage message={error} />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <ListViewReportsList 
                reports={reports} 
                totalCount={totalCount} 
                isLoading={isLoading} 
                error={error} 
                params={params} 
                updateParams={updateParams}
                contentType="reports"
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick stats section */}
      {!isInitialLoad && !error && reports.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slideIn">
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalCount || reports.length}</div>
              <div className="text-sm text-muted">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reports.length}</div>
              <div className="text-sm text-muted">Current Page</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {activeFilterCount}
              </div>
              <div className="text-sm text-muted">Active Filters</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
