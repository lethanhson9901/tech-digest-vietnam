import React, { useState, useEffect, memo } from 'react';
import { format } from 'date-fns';

const DailyPapersSection = () => {
  const [papersDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [papersLimit, setPapersLimit] = useState(10);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState(null);
  const [papersItems, setPapersItems] = useState([]);

  // Fetch Daily Papers
  useEffect(() => {
    const controller = new AbortController();

    const fetchPapers = async () => {
      try {
        setPapersLoading(true);
        setPapersError(null);

        const url = new URL('https://huggingface.co/api/daily_papers');
        if (papersDate) url.searchParams.set('date', papersDate);

        const res = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Daily Papers ${res.status}`);
        }

        const json = await res.json();

        // Normalize Daily Papers:
        // API returns an array of entries: { paper, title, ... }
        const rawItems = Array.isArray(json)
          ? json
          : Array.isArray(json.papers)
          ? json.papers
          : [];

        const items = rawItems.map((entry) => {
          const p = entry.paper || entry;
          const arxivId = p.id || entry.id;
          const authors = p.authors || [];
          const submitter =
            (p.submittedOnDailyBy && p.submittedOnDailyBy.fullname) ||
            (entry.submittedBy && entry.submittedBy.fullname) ||
            (authors[0] && (authors[0].name || authors[0].user?.fullname)) ||
            '';
          return {
            id: arxivId,
            title: p.title || entry.title,
            numAuthors: authors.length,
            submitter,
            likes: p.upvotes ?? entry.upvotes ?? 0,
            comments: entry.numComments ?? 0,
            collections: entry.numCollections ?? 0,
            url: arxivId ? `https://huggingface.co/papers/${arxivId}` : undefined,
          };
        });

        setPapersItems(items.slice(0, papersLimit));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setPapersError(err.message || 'Failed to load Daily Papers');
        }
      } finally {
        if (!controller.signal.aborted) {
          setPapersLoading(false);
        }
      }
    };

    fetchPapers();

    return () => controller.abort();
  }, [papersDate, papersLimit]);

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg md:text-xl text-neutral-900 dark:text-dark-text-primary">
              Daily Papers
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your daily dose of AI research by AK & the community
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
            <span className="text-[9px] text-neutral-600">Daily</span>
          </div>
        </div>
      </div>

      {/* List skeleton */}
      <div className="mt-1">
        {papersLoading && (
          <div className="py-4 text-xs text-neutral-500">Loading Daily Papers…</div>
        )}
        {papersError && !papersLoading && (
          <div className="py-3 text-xs text-red-500">
            {papersError}
          </div>
        )}
        {!papersLoading && !papersError && papersItems.length === 0 && (
          <div className="py-3 text-xs text-neutral-500">
            No papers found for this date.
          </div>
        )}
        {!papersLoading &&
          !papersError &&
          papersItems.map((paper, index) => {
            const rank = index + 1;
            const title = paper.title || 'Untitled paper';
            const arxivId = paper.id || '';
            const numAuthors = paper.numAuthors || 0;
            const submitter = paper.submitter || '';
            const likes = paper.likes ?? 0;
            const comments = paper.comments ?? 0;
            const collections = paper.collections ?? 0;
            const url = paper.url || (arxivId ? `https://huggingface.co/papers/${arxivId}` : undefined);

            // Pre-compute content to avoid re-computation during render
            const showCollections = collections > 0 && comments === 0;

            return (
              <DailyPaperItem
                key={`${arxivId || title}-${rank}`}
                rank={rank}
                title={title}
                submitter={submitter}
                numAuthors={numAuthors}
                showCollections={showCollections}
                collections={collections}
                comments={comments}
                likes={likes}
                url={url}
              />
            );
          })}
      </div>

      {/* Show more / less */}
      <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
        <button
          type="button"
          onClick={() => {
            setPapersLimit(prev => {
              if (prev > 10) return 10;
              if (prev > 5) return 5;
              return 5; // minimum is 5
            });
          }}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▲ show less
        </button>
        <button
          type="button"
          onClick={() => {
            setPapersLimit(prev => {
              if (prev === 5) return 10;
              if (prev === 10) return 20;
              // If already at 20, forward to Hugging Face papers
              window.open('https://huggingface.co/papers', '_blank', 'noopener,noreferrer');
              return prev;
            });
          }}
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▼ show more
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-3 text-[8px] text-neutral-500 text-center">
        Papers are automatically selected by the Hugging Face team and the community
      </div>
    </div>
  );
};

const DailyPaperItem = memo(({ rank, title, submitter, numAuthors, showCollections, collections, comments, likes, url }) => {
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
          <div className="text-[9px] text-neutral-500 mt-1 flex flex-wrap gap-x-2 gap-y-1">
            {submitter && (
              <span>by <span className="font-medium">{submitter}</span></span>
            )}
            {numAuthors > 0 && (
              <span>· {numAuthors} authors</span>
            )}
            {showCollections && (
              <span>· {collections} collections</span>
            )}
            {comments > 0 && (
              <span>· {comments} comments</span>
            )}
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="text-right">
        <div className="text-[8px] md:text-[9px] text-emerald-600 font-semibold">
          ❤ {likes}
        </div>
      </div>
    </div>
  );
});

export default DailyPapersSection;