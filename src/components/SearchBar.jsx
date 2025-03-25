// src/components/SearchBar.jsx (enhanced version)
import React, { useEffect, useRef, useState } from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (initialValue !== '') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-indigo-500 shadow-md' : 'shadow'
      }`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search reports by title, content, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none transition-all"
        />
        <div className="absolute left-3 top-3.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-[70px] top-[13px] text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
      
      {/* Search suggestions or tips could go here */}
      {isFocused && searchTerm.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          Press Enter to search for "{searchTerm}"
        </div>
      )}
    </form>
  );
};

export default SearchBar;
