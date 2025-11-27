import React, { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import ErrorMessage from '../components/ErrorMessage';
import ListViewReportsList from '../components/ListViewReportsList';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import TagComponent from '../components/TagComponent';
import { useAINewsReports } from '../hooks/useAINewsReports';

const AINewsReportsArchivePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { reports, total: totalCount, loading: isLoading, error, fetchReports } = useAINewsReports({ autoFetch: false });
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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white animate-slideIn flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                AI News Archive
              </h1>
              <p className="text-blue-100 mt-2 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                Khám phá {totalCount || 'tất cả'} báo cáo tin tức AI
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                searchValue={params.search}
                onClear={() => setParams(prev => ({ ...prev, search: '', skip: 0 }))}
                placeholder="Tìm kiếm tin tức AI..."
              />
            </div>

            {/* Filters section with enhanced animation */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showFilters ? 'max-h-96 opacity-100 mb-6 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
            }`}>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  Bộ lọc khoảng thời gian
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
                  color="blue"
                  showText
                  text="Đang tải tin tức AI..."
                />
                <div className="text-muted text-sm">
                  Đang lấy thông tin từ kho dữ liệu...
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
                  contentType="ai-news-reports"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINewsReportsArchivePage;