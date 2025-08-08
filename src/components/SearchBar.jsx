// src/components/SearchBar.jsx (enhanced version)
import React, { useState, useRef, useEffect } from 'react';

// Static common search terms (module-level to satisfy hook deps rules)
const COMMON_SEARCH_TERMS = [
  'AI', 'Machine Learning', 'Deep Learning', 'Neural Networks',
  'Blockchain', 'Cryptocurrency', 'Web3', 'DeFi',
  'Cloud Computing', 'DevOps', 'Kubernetes', 'Docker',
  'React', 'JavaScript', 'Python', 'Node.js',
  'Cybersecurity', 'Data Science', 'Big Data', 'Analytics',
  'Mobile Development', 'iOS', 'Android', 'Flutter',
  'UI/UX', 'Design Systems', 'Figma', 'Prototyping',
  'Startup', 'Tech News', 'Innovation', 'Funding'
];

const SearchBar = ({ onSearch, onClear, searchValue = '' }) => {
  const [localValue, setLocalValue] = useState(searchValue);
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Suggestions sẽ dựa trên COMMON_SEARCH_TERMS

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    // Generate suggestions based on current input
    if (localValue.trim() && localValue.length > 1) {
      const filtered = COMMON_SEARCH_TERMS.filter(term =>
        term.toLowerCase().includes(localValue.toLowerCase()) ||
        localValue.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedSuggestionIndex(-1);
  }, [localValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);
    
    // Debounced search
    if (value.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onSearch(value);
        setIsLoading(false);
      }, 300);
    } else {
      onClear();
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else if (localValue.trim()) {
          onSearch(localValue);
          setIsActive(false);
          setSuggestions([]);
        }
        break;
      case 'Escape':
        setIsActive(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        searchRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalValue(suggestion);
    onSearch(suggestion);
    setIsActive(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleClear = () => {
    setLocalValue('');
    onClear();
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    searchRef.current?.focus();
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setIsActive(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input Container */}
      <div className={`
        relative flex items-center
        bg-white dark:bg-gray-800
        border-2 transition-all duration-300 ease-in-out
        rounded-xl shadow-sm
        ${isActive 
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
          : 'border-neutral-200 dark:border-gray-600 hover:border-neutral-300 dark:hover:border-gray-500'
        }
        ${isLoading ? 'animate-pulse-glow' : ''}
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin w-5 h-5">
              <svg className="text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <svg 
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? 'text-indigo-500' : 'text-muted'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Search Input */}
        <input
          ref={searchRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Tìm kiếm báo cáo công nghệ..."
          className={`
            w-full pl-10 pr-10 py-3 
            bg-transparent
            text-primary
            placeholder-neutral-500
            border-none outline-none
            font-medium
            transition-all duration-200
          `}
          aria-label="Tìm kiếm báo cáo"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {localValue && (
            <button
            onClick={handleClear}
              className={`
              absolute right-3 p-1
              text-muted hover:text-secondary
              transition-all duration-200
              hover:scale-110 hover:rotate-90
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              rounded-full
            `}
            aria-label="Xóa tìm kiếm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {isActive && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className={`
            absolute top-full left-0 right-0 z-50 mt-2
            bg-white dark:bg-gray-800
            border border-neutral-200 dark:border-gray-600
            rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30
            backdrop-blur-sm
            animate-fadeIn
            max-h-64 overflow-y-auto
          `}
        >
          <div className="py-2">
            {/* Suggestions Header */}
            <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider border-b border-neutral-100 dark:border-gray-700">
              Gợi ý tìm kiếm
            </div>
            
            {/* Suggestion Items */}
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full text-left px-4 py-3
                  flex items-center justify-between
                  transition-all duration-150
                  ${selectedSuggestionIndex === index 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                    : 'text-secondary hover:bg-neutral-50 dark:hover:bg-gray-700/50'
                  }
                  focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20
                `}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
              >
                <div className="flex items-center">
                  <svg 
              className={`w-4 h-4 mr-3 transition-colors duration-150 ${
                      selectedSuggestionIndex === index 
                        ? 'text-indigo-500' 
                        : 'text-muted'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="font-medium">{suggestion}</span>
                </div>
                
                {selectedSuggestionIndex === index && (
                  <svg 
                    className="w-4 h-4 text-indigo-500 animate-slideIn" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-neutral-100 dark:border-gray-700 p-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                <kbd className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 rounded font-mono">↑↓</kbd> di chuyển
              </span>
              <span>
                <kbd className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 rounded font-mono">Enter</kbd> chọn
              </span>
              <span>
                <kbd className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 rounded font-mono">Esc</kbd> đóng
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Status */}
      {localValue && !isLoading && (
        <div className="absolute -bottom-6 left-0 text-xs text-muted">
          Đang tìm: "<span className="font-medium text-indigo-600 dark:text-indigo-400">{localValue}</span>"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
