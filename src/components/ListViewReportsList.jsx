// src/components/ListViewReportsList.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const ListViewReportsList = ({ reports, totalCount, isLoading, error, params, updateParams, contentType = 'reports' }) => {
  const [hoveredId, setHoveredId] = useState(null);

  // Generate the appropriate link path based on content type
  const getLinkPath = (report) => {
    switch (contentType) {
      case 'json-reports':
        return `/json-reports/${report.id}`;
      case 'combined-analysis':
        return `/combined-analysis/${report.id}`;
      case 'reddit-reports':
        return `/reddit-reports/${report.id}`;
      default:
        return `/reports/${report.id}`;
    }
  };

  // Get appropriate icon for content type
  const getContentIcon = () => {
    switch (contentType) {
      case 'json-reports':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId ? 'text-blue-600' : 'text-blue-500'} transition-colors duration-200`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'combined-analysis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId ? 'text-emerald-600' : 'text-emerald-500'} transition-colors duration-200`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'reddit-reports':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId ? 'text-orange-600' : 'text-orange-500'} transition-colors duration-200`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId ? 'text-indigo-600' : 'text-indigo-500'} transition-colors duration-200`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get appropriate color scheme for content type
  const getColorScheme = () => {
    switch (contentType) {
      case 'json-reports':
        return {
          hover: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          iconBgHover: 'bg-blue-100',
          textColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'combined-analysis':
        return {
          hover: 'bg-emerald-50',
          iconBg: 'bg-emerald-100',
          iconBgHover: 'bg-emerald-100',
          textColor: 'text-emerald-600',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        };
      case 'reddit-reports':
        return {
          hover: 'bg-orange-50',
          iconBg: 'bg-orange-100',
          iconBgHover: 'bg-orange-100',
          textColor: 'text-orange-600',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          hover: 'bg-indigo-50',
          iconBg: 'bg-gray-100',
          iconBgHover: 'bg-indigo-100',
          textColor: 'text-indigo-600',
          badgeColor: 'bg-green-100 text-green-800'
        };
    }
  };

  const colors = getColorScheme();

  if (isLoading && reports.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (reports.length === 0) {
    const contentTypeLabel = contentType === 'combined-analysis' ? 'combined analysis' : contentType.replace('-', ' ');
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No {contentTypeLabel} found</h3>
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
              <Link to={getLinkPath(report)} className={`block ${hoveredId === report.id ? colors.hover : 'hover:bg-gray-50'}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${hoveredId === report.id ? colors.iconBgHover : colors.iconBg} transition-colors duration-200`}>
                        {getContentIcon()}
                      </div>
                      <div className="ml-3">
                        <p className={`truncate text-sm font-medium ${colors.textColor}`}>{report.filename}</p>
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
                        <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${colors.badgeColor}`}>
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
                        View {contentType === 'combined-analysis' ? 'Analysis' : 'Report'}
                      </p>
                    </div>
                    <div className={`transition-transform duration-200 ${hoveredId === report.id ? 'translate-x-1' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${hoveredId === report.id ? colors.textColor.replace('text-', 'text-').replace('-600', '-500') : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
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
            <span className="font-medium">{totalCount}</span> {contentType === 'combined-analysis' ? 'analysis reports' : contentType.replace('-', ' ')}
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
