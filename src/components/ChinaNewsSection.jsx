// src/components/ChinaNewsSection.jsx
import React, { useState, useEffect, memo } from 'react';

const ChinaNewsSection = ({ source, index, rawContent }) => {
  const [newsLimit, setNewsLimit] = useState(10);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [newsItems, setNewsItems] = useState([]);

  // Process news from raw content passed from parent
  useEffect(() => {
    try {
      setNewsLoading(true);
      setNewsError(null);

      if (rawContent) {
        // Process the response to extract news items
        // The response contains content with [SOURCE] tags, we need to parse it
        const sourceRegex = new RegExp(`\\[SOURCE\\] ${source.name}.*?\\n(.*?)(?=\\[SOURCE\\]|$)`, 's');
        const match = rawContent.match(sourceRegex);

        if (match) {
          // Extract news items from matched content
          const content = match[1];
          const newsLines = content.split('\n').filter(line => line.trim() !== '');

          const items = [];
          newsLines.forEach(line => {
            if (line.trim() && /^\d+\./.test(line)) {
              // Extract title and URL
              const titleMatch = line.match(/^(\d+)\.\s*(.*?)\s*\[URL:(.*?)\]/);
              if (titleMatch) {
                const [, rank, title, url] = titleMatch;
                items.push({
                  id: `${source.name}-${rank}`,
                  rank: parseInt(rank),
                  title: title.trim(),
                  url: url || undefined
                });
              }
            }
          });

          setNewsItems(items.slice(0, newsLimit));
        } else {
          setNewsError(`No data found for source: ${source.name}`);
        }
      } else {
        // Fallback to mock data if no raw content provided
        const mockItems = Array.from({ length: 30 }, (_, i) => ({
          id: `${source.name}-${i + 1}`,
          rank: i + 1,
          title: `Tin tức mẫu ${i + 1} từ ${source.languageName}`,
          url: `https://example.com/news/${source.name}/${i + 1}`
        }));
        setNewsItems(mockItems.slice(0, newsLimit));
      }
    } catch (err) {
      setNewsError(err.message || `Failed to process news from ${source.languageName}`);
    } finally {
      setNewsLoading(false);
    }
  }, [source, rawContent, newsLimit]);

  // Determine the icon based on the source
  const getSourceIcon = (sourceName) => {
    switch (sourceName) {
      case 'toutiao':
        return '📰';
      case 'baidu':
        return '🔍';
      case 'wallstreetcn-hot':
        return '💼';
      case 'thepaper':
        return '📝';
      case 'bilibili-hot-search':
        return '📺';
      case 'cls-hot':
        return '📈';
      case 'zhihu-daily':
        return '❓';
      case 'weibo-hot':
        return '🌐';
      case 'tieba-hot':
        return '💬';
      case 'toutiao-scitech':
        return '🔬';
      case 'netease-news':
        return '📡';
      default:
        return '🌐';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <span className="text-lg">{getSourceIcon(source.name)}</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg md:text-xl text-neutral-900 dark:text-dark-text-primary">
              {source.languageName}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {source.title} ({source.name})
            </p>
          </div>
        </div>
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary transition-colors"
        >
          ⋮
        </button>
      </div>

      {/* Controls */}
      <div className="mt-4 mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] md:text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-neutral-100 dark:bg-dark-bg-tertiary px-3 py-1">
            <span className="text-[9px] text-neutral-600">Tin Trung Quốc</span>
          </div>
        </div>
      </div>

      {/* List skeleton */}
      <div className="mt-1">
        {newsLoading && (
          <div className="py-4 text-xs text-neutral-500">Đang tải {source.languageName}…</div>
        )}
        {newsError && !newsLoading && (
          <div className="py-3 text-xs text-red-500">
            {newsError}
          </div>
        )}
        {!newsLoading && !newsError && newsItems.length === 0 && (
          <div className="py-3 text-xs text-neutral-500">
            Không tìm thấy tin tức cho nguồn này.
          </div>
        )}
        {!newsLoading &&
          !newsError &&
          newsItems.map((item) => {
            return (
              <NewsItem
                key={item.id}
                rank={item.rank}
                title={item.title}
                url={item.url}
              />
            );
          })}
      </div>

      {/* Show more / less */}
      <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
        <button
          type="button"
          onClick={() => {
            setNewsLimit(prev => {
              if (prev > 10) return 10;
              if (prev > 5) return 5;
              return 5; // minimum is 5
            });
          }}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▲ hiện ít hơn
        </button>
        <button
          type="button"
          onClick={() => {
            setNewsLimit(prev => {
              if (prev === 5) return 10;
              if (prev === 10) return 20;
              // If already at 20, forward to source page
              window.open(`https://www.${source.name}.com`, '_blank', 'noopener,noreferrer');
              return prev;
            });
          }}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▼ hiện thêm
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-3 text-[8px] text-neutral-500 text-center">
        Tin tức được cập nhật từ {source.languageName} ({source.name})
      </div>
    </div>
  );
};

const NewsItem = memo(({ rank, title, url }) => {
  return (
    <div
      className="group flex items-center justify-between gap-4 py-2.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary cursor-pointer transition-colors"
      onClick={() => {
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-5 text-[11px] font-semibold text-neutral-400 text-right">
          {rank}
        </div>
        <div className="min-w-0">
          <div className="text-xs md:text-sm font-semibold text-primary-700 dark:text-dark-accent-primary-bg group-hover:underline">
            {title}
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="text-right">
        <div className="text-[8px] md:text-[9px] text-emerald-600 font-semibold">
          🔗
        </div>
      </div>
    </div>
  );
});

export default ChinaNewsSection;