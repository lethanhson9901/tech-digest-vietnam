// src/components/DateRangePicker.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useState } from 'react';

const DateRangePicker = ({ onDateRangeChange }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleApply = () => {
    onDateRangeChange(dateFrom, dateTo);
    setIsActive(true);
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    onDateRangeChange('', '');
    setIsActive(false);
  };

  // Helper to format dates for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`bg-white p-5 rounded-lg shadow-md border ${isActive ? 'border-indigo-300' : 'border-gray-200'} transition-colors`}>
      <h3 className="text-lg font-medium text-primary mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Filter by Date
      </h3>
      
      {isActive && (
        <div className="mb-3 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Filtering: {dateFrom ? formatDateForDisplay(dateFrom) : 'Any start date'} to {dateTo ? formatDateForDisplay(dateTo) : 'Any end date'}
          </span>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              min={dateFrom} // Prevent selecting a date before the from date
            />
          </div>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
            disabled={!dateFrom && !dateTo}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Apply
          </button>
           <button
            onClick={handleReset}
             className="flex-1 bg-gray-200 hover:bg-gray-300 text-secondary py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
        
        {/* Quick date range options */}
          <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-secondary mb-2">Quick select:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 7);
                
                setDateFrom(format(lastWeek, 'yyyy-MM-dd'));
                setDateTo(format(today, 'yyyy-MM-dd'));
              }}
              className="bg-gray-100 hover:bg-gray-200 text-secondary py-1 px-2 rounded transition-colors"
            >
              Last 7 days
            </button>
            <button 
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);
                
                setDateFrom(format(lastMonth, 'yyyy-MM-dd'));
                setDateTo(format(today, 'yyyy-MM-dd'));
              }}
              className="bg-gray-100 hover:bg-gray-200 text-secondary py-1 px-2 rounded transition-colors"
            >
              Last 30 days
            </button>
            <button 
              onClick={() => {
                const today = new Date();
                const lastQuarter = new Date();
                lastQuarter.setMonth(today.getMonth() - 3);
                
                setDateFrom(format(lastQuarter, 'yyyy-MM-dd'));
                setDateTo(format(today, 'yyyy-MM-dd'));
              }}
              className="bg-gray-100 hover:bg-gray-200 text-secondary py-1 px-2 rounded transition-colors"
            >
              Last 3 months
            </button>
            <button 
              onClick={() => {
                const today = new Date();
                const lastYear = new Date();
                lastYear.setFullYear(today.getFullYear() - 1);
                
                setDateFrom(format(lastYear, 'yyyy-MM-dd'));
                setDateTo(format(today, 'yyyy-MM-dd'));
              }}
              className="bg-gray-100 hover:bg-gray-200 text-secondary py-1 px-2 rounded transition-colors"
            >
              Last year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;