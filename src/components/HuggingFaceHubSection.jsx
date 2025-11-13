import React, { useState, useEffect, memo } from 'react';
import { format } from 'date-fns';

const HuggingFaceHubSection = () => {
  const [hfHubTab, setHfHubTab] = useState('models'); // 'models' | 'datasets' | 'spaces'
  const [hfHubLimit, setHfHubLimit] = useState(10);
  const [hfHubLoading, setHfHubLoading] = useState(false);
  const [hfHubError, setHfHubError] = useState(null);
  const [hfHubItems, setHfHubItems] = useState([]);

  // Fetch Hugging Face Hub trending (client-side, no backend dependency)
  useEffect(() => {
    const controller = new AbortController();

    const fetchHub = async () => {
      try {
        setHfHubLoading(true);
        setHfHubError(null);

        const typeParam =
          hfHubTab === 'datasets'
            ? 'dataset'
            : hfHubTab === 'spaces'
            ? 'space'
            : undefined;

        const url = new URL('https://huggingface.co/api/trending');
        if (typeParam) url.searchParams.set('type', typeParam);

        const res = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HF Hub ${res.status}`);
        }

        const json = await res.json();
        // Normalize HF trending response:
        // - Some responses: { recentlyTrending: [ { repoData, repoType } ] }
        // - Others: raw array of repos
        const rawItems = Array.isArray(json)
          ? json
          : Array.isArray(json.recentlyTrending)
          ? json.recentlyTrending
          : [];

        const items = rawItems.map((entry) => {
          const repo = entry.repoData || entry;
          const repoType = entry.repoType || repo.repoType || hfHubTab.slice(0, -1) || 'model';

          return {
            id: repo.id,
            author: repo.author,
            authorData: repo.authorData,
            repoType,
            pipeline_tag: repo.pipeline_tag,
            tags: repo.tags,
            likes: repo.likes,
            downloads:
              repo.downloads ??
              repo.downloadsAllTime ??
              repo.downloadsLastMonth ??
              undefined,
            lastModified: repo.lastModified,
            runtime: repo.runtime,
          };
        });

        setHfHubItems(items.slice(0, hfHubLimit));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setHfHubError(err.message || 'Failed to load Hugging Face Hub trending');
        }
      } finally {
        if (!controller.signal.aborted) {
          setHfHubLoading(false);
        }
      }
    };

    fetchHub();

    return () => controller.abort();
  }, [hfHubTab, hfHubLimit]);

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center">
            <span className="text-xl">🤗</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg md:text-xl text-neutral-900 dark:text-dark-text-primary">
              Hugging Face Hub
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Trending Models, Datasets & Spaces
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

      {/* Controls (static UI, ready for wiring) */}
      <div className="mt-4 mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Tabs */}
        <div className="inline-flex rounded-full bg-neutral-100 dark:bg-dark-bg-tertiary p-1 text-xs">
          <button
            type="button"
            onClick={() => setHfHubTab('models')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              hfHubTab === 'models'
                ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Models
          </button>
          <button
            type="button"
            onClick={() => setHfHubTab('datasets')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              hfHubTab === 'datasets'
                ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Datasets
          </button>
          <button
            type="button"
            onClick={() => setHfHubTab('spaces')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              hfHubTab === 'spaces'
                ? 'bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Spaces
          </button>
        </div>
        {/* Right controls: removed Time window & Top N for cleaner UI */}
      </div>

      {/* List (Hackernews-style rows) */}
      <div className="mt-1">
        {hfHubLoading && (
          <div className="py-4 text-xs text-neutral-500">
            Loading Hugging Face Hub trending…
          </div>
        )}

        {hfHubError && !hfHubLoading && (
          <div className="py-3 text-xs text-red-500">
            {hfHubError}
          </div>
        )}

        {!hfHubLoading && !hfHubError && hfHubItems.length === 0 && (
          <div className="py-3 text-xs text-neutral-500">
            No trending data available at the moment.
          </div>
        )}

            {!hfHubLoading &&
              !hfHubError &&
              hfHubItems.map((item, index) => {
                const rank = index + 1;

                // Bản ghi chuẩn hóa từ recentlyTrending:
                const repo = item.repoData || item;
                const id = repo.id || item.id || '';
                const owner = repo.author || '';
                const fullName = id || owner || 'Unknown';

                const type =
                  item.repoType ||
                  repo.repoType ||
                  (hfHubTab === 'datasets'
                    ? 'dataset'
                    : hfHubTab === 'spaces'
                    ? 'space'
                    : 'model');

                const pipeline = repo.pipeline_tag || (repo.tags && repo.tags[0]);

                const likes =
                  repo.likes ??
                  item.likes ??
                  repo.likeCount ??
                  item.likeCount ??
                  0;

                const downloads =
                  repo.downloads ??
                  item.downloads ??
                  repo.downloadsAllTime ??
                  item.downloadsAllTime ??
                  repo.downloadsLastMonth ??
                  item.downloadsLastMonth ??
                  null;

                const updated =
                  repo.lastModified ||
                  item.lastModified ||
                  repo.lastModifiedAt ||
                  item.lastModifiedAt ||
                  repo.lastUpdated ||
                  item.lastUpdated ||
                  null;

                let url;
                if (id) {
                  if (type === 'dataset') {
                    url = `https://huggingface.co/datasets/${id}`;
                  } else if (type === 'space') {
                    url = `https://huggingface.co/spaces/${id}`;
                  } else {
                    url = `https://huggingface.co/${id}`;
                  }
                }

                // Format updated date only if necessary
                const formattedUpdated = updated ? (() => {
                  try {
                    return format(new Date(updated), 'yyyy-MM-dd');
                  } catch {
                    return updated;
                  }
                })() : null;

                return (
                  <HuggingFaceHubItem
                    key={`${fullName}-${rank}`}
                    rank={rank}
                    fullName={fullName}
                    type={type}
                    pipeline={pipeline}
                    likes={likes}
                    downloads={downloads}
                    formattedUpdated={formattedUpdated}
                    repo={repo}
                    url={url}
                  />
                );
              })}
      </div>

      {/* Show more / less */}
      <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
        <button
          type="button"
          onClick={() =>
            setHfHubLimit((prev) => {
              const next = Math.max(10, prev - 10);
              return next;
            })
          }
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▲ show less
        </button>
        <button
          type="button"
          onClick={() =>
            setHfHubLimit((prev) => {
              const next = prev + 10;
              if (next <= 20) {
                return next;
              }
              // nếu đã vượt 20, forward sang Hugging Face theo tab hiện tại
              const base = 'https://huggingface.co';
              if (hfHubTab === 'datasets') {
                window.open(`${base}/datasets`, '_blank', 'noopener,noreferrer');
              } else if (hfHubTab === 'spaces') {
                window.open(`${base}/spaces`, '_blank', 'noopener,noreferrer');
              } else {
                window.open(`${base}/models`, '_blank', 'noopener,noreferrer');
              }
              return prev;
            })
          }
          className="hover:text-neutral-800 transition-colors flex items-center gap-1"
        >
          ▼ show more
        </button>
      </div>

      {/* Footer note removed for cleaner look */}
    </div>
  );
};

const HuggingFaceHubItem = memo(({ rank, fullName, type, pipeline, likes, downloads, formattedUpdated, repo, url }) => {
  const { authorData } = repo;
  const owner = repo.author || '';

  return (
    <div
      className="group flex items-center justify-between gap-4 py-2.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary cursor-pointer transition-colors"
      onClick={() => {
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-5 text-[11px] font-semibold text-neutral-400 text-right">
          {rank}
        </div>
        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 overflow-hidden">
          {authorData?.avatarUrl && (
            <img
              src={authorData.avatarUrl}
              alt={owner || 'avatar'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs md:text-sm font-semibold text-primary-700 dark:text-dark-accent-primary-bg truncate">
              {fullName}
            </span>
            <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-neutral-900/80 text-neutral-50 uppercase">
              {type}
            </span>
            {pipeline && (
              <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-neutral-900/80 text-neutral-50">
                {pipeline}
              </span>
            )}
          </div>
          <div className="text-[9px] text-neutral-500">
            ❤ {likes}
            {downloads != null && (
              <> · ⬇ {downloads.toLocaleString?.() || downloads}</>
            )}
            {formattedUpdated && (
              <>
                {' '}
                · Last updated: {formattedUpdated}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className="text-right text-[9px] md:text-[10px] text-emerald-600 font-semibold">
        ❤ {likes}
        {downloads != null && (
          <div className="text-[8px] text-neutral-500">
            ⬇ {downloads.toLocaleString?.() || downloads}
          </div>
        )}
      </div>
    </div>
  );
});

export default HuggingFaceHubSection;