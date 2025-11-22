import React, { useState, useEffect, memo } from 'react';

// Function to parse RSS XML data
const parseRSSData = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const items = xmlDoc.querySelectorAll('item');
  const repos = [];

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    
    // Extract repository owner and name from title
    let owner = '';
    let name = '';
    if (title.includes('/')) {
      const parts = title.split('/');
      owner = parts[0]?.trim() || '';
      name = parts.slice(1).join('/')?.trim() || '';
    } else {
      name = title;
    }

    repos.push({
      id: link, // Using link as unique identifier
      title, // Full title like "owner/repo"
      owner,
      name,
      link,
      description,
      // Extract stars, language, etc. from description if present
    });
  });

  return repos;
};

const GitHubTrendingSection = () => {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly

  // Fetch GitHub trending data
  useEffect(() => {
    const controller = new AbortController();

    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construct the RSS URL based on selected time range
        const rssUrls = {
          daily: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
          weekly: 'https://mshibanami.github.io/GitHubTrendingRSS/weekly/all.xml',
          monthly: 'https://mshibanami.github.io/GitHubTrendingRSS/monthly/all.xml'
        };

        const url = rssUrls[timeRange];

        const res = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`GitHub Trending RSS ${res.status}`);
        }

        const xmlText = await res.text();
        const repos = parseRSSData(xmlText);

        setTrendingRepos(repos.slice(0, limit));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load GitHub trending repositories');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTrending();

    return () => controller.abort();
  }, [limit, timeRange]);

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    if (newLimit < 5) newLimit = 5;
    if (newLimit > 50) newLimit = 50;
    setLimit(newLimit);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-lg md:text-xl text-neutral-900 dark:text-dark-text-primary">
              GitHub Trending
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Các repositories đang thịnh hành trên GitHub
            </p>
          </div>
        </div>
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary transition-colors"
          onClick={() => window.open('https://github.com/trending', '_blank', 'noopener,noreferrer')}
        >
          ⋮
        </button>
      </div>

      {/* Controls */}
      <div className="mt-4 mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] md:text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-neutral-100 dark:bg-dark-bg-tertiary p-1 text-xs">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs ${
                timeRange === 'daily'
                  ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs ${
                timeRange === 'weekly'
                  ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-full text-xs ${
                timeRange === 'monthly'
                  ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        {loading && (
          <div className="py-4 text-xs text-neutral-500 text-center col-span-2">Loading GitHub trending repositories…</div>
        )}
        {error && !loading && (
          <div className="py-3 text-xs text-red-500 text-center col-span-2">
            {error}
          </div>
        )}
        {!loading && !error && trendingRepos.length === 0 && (
          <div className="py-3 text-xs text-neutral-500 text-center col-span-2">
            No trending repositories available at the moment.
          </div>
        )}

        {!loading && !error && trendingRepos.map((repo, index) => {
          const rank = index + 1;
          const url = repo.link || `https://github.com/${repo.title}`;

          return (
            <TrendingRepoItem
              key={`${repo.title}-${rank}`}
              rank={rank}
              title={repo.title}
              description={repo.description}
              url={url}
            />
          );
        })}
      </div>

      {/* Show more / less */}
      <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
        <button
          type="button"
          onClick={() => handleLimitChange(limit - 5)}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
          disabled={limit <= 5}
        >
          ▲ show less
        </button>
        <button
          type="button"
          onClick={() => {
            if (limit < 30) {
              handleLimitChange(limit + 5);
            } else {
              // If at max limit, open GitHub trending page
              window.open('https://github.com/trending', '_blank', 'noopener,noreferrer');
            }
          }}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
          disabled={limit >= 50}
        >
          ▼ show more
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-3 text-[8px] text-neutral-500 text-center">
        Dữ liệu được cập nhật từ GitHub Trending thông qua RSS feed
      </div>
    </div>
  );
};

const TrendingRepoItem = memo(({ rank, title, description, url }) => {
  // Clean up description to remove HTML tags for display
  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, '').substring(0, 100) + (description.length > 100 ? '...' : '')
    : '';

  // Extract language from description if available
  // This is a simple approach - in a real implementation you might want to parse more carefully
  const extractLanguageInfo = () => {
    // Look for common patterns in GitHub repo descriptions
    const matches = description.match(/<p>(.*?)<\/p>/);
    if (matches && matches[1]) {
      return matches[1].substring(0, 80) + (matches[1].length > 80 ? '...' : '');
    }
    return cleanDescription.substring(0, 80) + (cleanDescription.length > 80 ? '...' : '');
  };

  const descriptionText = extractLanguageInfo();

  return (
    <div
      className="group flex items-start justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary cursor-pointer transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-[#374151] min-h-[60px]"
      onClick={() => {
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {/* Left */}
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <div className="w-5 text-[11px] font-semibold text-neutral-400 text-right flex-shrink-0 pt-0.5">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-primary-700 dark:text-dark-accent-primary-bg group-hover:underline break-words">
            {title}
          </div>
          {descriptionText && (
            <div className="text-[8px] text-neutral-500 mt-1 line-clamp-2 break-words">
              {descriptionText}
            </div>
          )}
        </div>
      </div>
      {/* Right */}
      <div className="flex-shrink-0 pt-0.5">
        <div className="text-[8px] font-semibold text-emerald-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Trending
        </div>
      </div>
    </div>
  );
});

export default GitHubTrendingSection;