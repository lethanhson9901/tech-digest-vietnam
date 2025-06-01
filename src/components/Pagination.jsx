import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = true,
  itemsPerPage = 10,
  totalItems = 0
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  // Calculate item range for current page
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      {/* Pagination Info */}
      {showInfo && totalItems > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 animate-fadeIn">
          Hiển thị{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {startItem} - {endItem}
          </span>{' '}
          trong{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {totalItems}
          </span>{' '}
          kết quả
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-2" aria-label="Phân trang">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canGoBack}
          className={`
            group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg
            transition-all duration-200 ease-in-out
            ${canGoBack 
              ? 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 shadow-sm hover:shadow-md' 
              : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
          aria-label="Trang trước"
        >
          <svg 
            className={`w-4 h-4 mr-1 transition-transform duration-200 ${
              canGoBack ? 'group-hover:-translate-x-0.5' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Trước
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={`${page}-${index}`}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500 dark:text-gray-400 select-none">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
                  </svg>
                </span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`
                    relative min-w-[2.5rem] h-10 px-3 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    ${page === currentPage
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border-2 border-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 shadow-sm hover:shadow-md'
                    }
                  `}
                  aria-label={`Trang ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page === currentPage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-20 animate-pulse" />
                  )}
                  <span className="relative z-10">{page}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canGoForward}
          className={`
            group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg
            transition-all duration-200 ease-in-out
            ${canGoForward 
              ? 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 shadow-sm hover:shadow-md' 
              : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
          aria-label="Trang sau"
        >
          Sau
          <svg 
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              canGoForward ? 'group-hover:translate-x-0.5' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>

      {/* Quick Jump Controls for large pagination */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-4 text-sm">
          {/* Jump to First */}
          {currentPage > 5 && (
            <button
              onClick={() => handlePageChange(1)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200 hover:underline"
            >
              ⏮ Đầu tiên
            </button>
          )}

          {/* Jump to Last */}
          {currentPage < totalPages - 4 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200 hover:underline"
            >
              Cuối cùng ⏭
            </button>
          )}
        </div>
      )}

      {/* Page Size Selector (Optional) */}
      {itemsPerPage && totalItems > 20 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Hiển thị:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              // This would need to be handled by parent component
              console.log('Change page size to:', e.target.value);
            }}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>mục/trang</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Pagination;