// src/components/ListViewReportsList.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const ListViewReportsList = ({ reports, totalCount, isLoading, error, params, updateParams }) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (isLoading && reports.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        <button 
          onClick={() => updateParams({ search: '', dateFrom: '', dateTo: '', skip: 0 })}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li 
              key={report.id}
              onMouseEnter={() => setHoveredId(report.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="transition-colors duration-200"
            >
              <Link to={`/reports/${report.id}`} className={`block ${hoveredId === report.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${hoveredId === report.id ? 'bg-indigo-100' : 'bg-gray-100'} transition-colors duration-200`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId === report.id ? 'text-indigo-600' : 'text-indigo-500'} transition-colors duration-200`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="truncate text-sm font-medium text-indigo-600">{report.filename}</p>
                        {/* Extract a preview from content if available */}
                        {report.content && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                            {report.content.substring(0, 100).replace(/[#*]/g, '')}...
                          </p>
                        )}
                      </div>
                    </div>
                    {report.upload_date && (
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {format(new Date(report.upload_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Report
                      </p>
                    </div>
                    <div className={`transition-transform duration-200 ${hoveredId === report.id ? 'translate-x-1' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId === report.id ? 'text-indigo-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isLoading && <div className="text-center py-4"><LoadingSpinner size="small" /></div>}

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{Math.min(params.skip + 1, totalCount)}</span> to{' '}
            <span className="font-medium">{Math.min(params.skip + reports.length, totalCount)}</span> of{' '}
            <span className="font-medium">{totalCount}</span> reports
          </div>
          <Pagination
            currentPage={Math.floor(params.skip / params.limit) + 1}
            totalPages={Math.ceil(totalCount / params.limit)}
            onPageChange={(page) => updateParams({ skip: (page - 1) * params.limit })}
          />
        </div>
      </div>
    </div>
  );
};

export default ListViewReportsList;
