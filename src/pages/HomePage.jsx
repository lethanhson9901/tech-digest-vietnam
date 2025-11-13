// src/pages/HomePage.jsx (enhanced version)
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchLatestReport } from '../services/api';

const HomePage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Hugging Face Hub state
  const [hfHubTab, setHfHubTab] = useState('models'); // 'models' | 'datasets' | 'spaces'
  const [hfHubLimit, setHfHubLimit] = useState(10);
  const [hfHubLoading, setHfHubLoading] = useState(false);
  const [hfHubError, setHfHubError] = useState(null);
  const [hfHubItems, setHfHubItems] = useState([]);

  // Daily Papers state
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

  // OpenRouter Models state
  const [openRouterModels, setOpenRouterModels] = useState([]);
  const [openRouterLoading, setOpenRouterLoading] = useState(false);
  const [openRouterError, setOpenRouterError] = useState(null);
  const [openRouterLimit, setOpenRouterLimit] = useState(5);

  useEffect(() => {
    const loadLatestReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLatestReport();
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to load latest report');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial data fetch kept for compatibility (can be removed later if not used)
    loadLatestReport();

    // Animation delay
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleMotionChange();
    mediaQuery.addEventListener?.('change', handleMotionChange);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

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

  // Fetch OpenRouter Models
  useEffect(() => {
    const controller = new AbortController();

    const fetchOpenRouter = async () => {
      try {
        setOpenRouterLoading(true);
        setOpenRouterError(null);

        const url = 'https://openrouter.ai/api/v1/models';

        const res = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`OpenRouter ${res.status}`);
        }

        const json = await res.json();
        const raw = Array.isArray(json?.data) ? json.data : [];

        const models = raw.map((m) => {
          const pricing = m.pricing || {};
          const prompt = Number(pricing.prompt || 0);
          const completion = Number(pricing.completion || 0);
          const request = Number(pricing.request || 0);

          const effectivePrompt = isNaN(prompt) ? 0 : prompt;
          const effectiveCompletion = isNaN(completion) ? 0 : completion;
          const effectiveRequest = isNaN(request) ? 0 : request;

          return {
            id: m.id,
            name: m.name || m.id,
            description: m.description || '',
            context_length: m.context_length,
            architecture: m.architecture,
            pricing: {
              prompt: effectivePrompt,
              completion: effectiveCompletion,
              request: effectiveRequest,
            },
            top_provider: m.top_provider,
            raw: m,
          };
        });

        setOpenRouterModels(models.slice(0, openRouterLimit));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setOpenRouterError(
            err.message || 'Failed to load OpenRouter models'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setOpenRouterLoading(false);
        }
      }
    };

    fetchOpenRouter();
    return () => controller.abort();
  }, [openRouterLimit]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-6">
        <LoadingSpinner />
        <div className="text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 rounded-lg w-48 mb-2 mx-auto bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-4 rounded-lg w-32 mx-auto bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!report) {
    return <ErrorMessage message="Latest report not found" />;
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 ${prefersReducedMotion ? '' : 'transition-all duration-700 transform'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Enhanced Hero Section */}
      <div className="mb-10 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className={`absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'animate-float-gentle'}`}
               style={{ background: 'var(--gradient-primary)' }}></div>
          <div className={`absolute top-20 right-1/4 w-48 h-48 rounded-full opacity-15 dark:opacity-5 ${prefersReducedMotion ? '' : 'animate-float-gentle'}`}
               style={{ background: 'var(--gradient-secondary)', animationDelay: '-2s' }}></div>
        </div>

        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Tech Digest Vietnam
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 text-secondary">
            📊 Cập nhật <span className="font-semibold text-primary-600 dark:text-dark-accent-primary-bg">xu hướng công nghệ</span> mới nhất từ hệ sinh thái công nghệ Việt Nam
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-primary-50 dark:bg-dark-bg-tertiary border border-primary-200 dark:border-dark-border-secondary">
              <svg className="w-5 h-5 text-primary-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-primary-700 dark:text-dark-text-primary">
                Cập nhật hàng ngày
              </span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-accent-emerald-light/10 dark:bg-dark-accent-emerald/10 border border-accent-emerald-light/30 dark:border-dark-accent-emerald/30">
              <svg className="w-5 h-5 text-accent-emerald dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-accent-emerald-dark dark:text-dark-accent-emerald">
                Đáng tin cậy
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* HF Trending Layout */}
      <div className="space-y-8 mb-14">
        {/* Card 1: Hugging Face Hub Trending */}
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
                  <div
                    key={`${fullName}-${rank}`}
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
                        {repo.authorData?.avatarUrl && (
                          <img
                            src={repo.authorData.avatarUrl}
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

        {/* Card 3: OpenRouter Models */}
        <div className="bg-white dark:bg-[#020817] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                <span className="text-lg">🛰️</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg md:text-xl text-neutral-900 dark:text-dark-text-primary">
                  OpenRouter Models
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Danh sách các model từ OpenRouter AI ecosystem
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
                <span className="text-[9px] text-neutral-600">Models</span>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="mt-1">
            {openRouterLoading && (
              <div className="py-4 text-xs text-neutral-500">
                Loading OpenRouter models…
              </div>
            )}
            {openRouterError && !openRouterLoading && (
              <div className="py-3 text-xs text-red-500">
                {openRouterError}
              </div>
            )}
            {!openRouterLoading &&
              !openRouterError &&
              openRouterModels.length === 0 && (
                <div className="py-3 text-xs text-neutral-500">
                  No models available from OpenRouter.
                </div>
              )}

            {!openRouterLoading &&
              !openRouterError &&
              openRouterModels.map((model, index) => {
                // Pre-calculate values outside the component rendering
                const rank = index + 1;
                const id = model.id || model.raw?.id || '';
                const name = model.name || id || 'Unnamed model';
                const ctx = model.context_length || model.raw?.context_length;
                const pricing = model.pricing || {};
                const prompt = pricing.prompt ?? 0;
                const completion = pricing.completion ?? 0;
                const request = pricing.request ?? 0;

                // Display effective indicative price per million tokens
                const unit =
                  request && request > 0
                    ? `$${request}/req`
                    : prompt || completion
                    ? `$${(prompt * 1000000).toFixed(2)}/M input, $${(completion * 1000000).toFixed(2)}/M output`
                    : 'Free';

                // Limit description to 100 characters for better readability
                const description = model.raw?.description || '';
                const truncatedDescription = description.length > 100
                  ? description.substring(0, 100) + '...'
                  : description;

                const url = `https://openrouter.ai/models/${encodeURIComponent(id)}`;

                return (
                  <div
                    key={`${id}-${rank}`} // Using id and rank as key
                    className="group flex items-center justify-between gap-4 py-2.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary cursor-pointer transition-colors"
                    onClick={() => {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {/* Left */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-5 text-[11px] font-semibold text-neutral-400 text-right mt-0.5">
                        {rank}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs md:text-sm font-semibold text-primary-700 dark:text-dark-accent-primary-bg truncate">
                          {name}
                        </div>
                        <div className="text-[9px] text-neutral-500 mt-1">
                          {truncatedDescription}
                        </div>
                        <div className="text-[9px] text-neutral-500 mt-1 flex flex-wrap gap-1">
                          {ctx && (
                            <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-dark-bg-tertiary rounded text-[8px]">
                              {ctx.toLocaleString?.() || ctx} tokens
                            </span>
                          )}
                          {model.raw?.architecture?.modality && (
                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-[8px] text-blue-700 dark:text-blue-300">
                              {model.raw.architecture.modality}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Right */}
                    <div className="text-right text-[8px] md:text-[9px] text-emerald-600 font-semibold">
                      {unit}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Show more / less */}
          <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
            <button
              type="button"
              onClick={() => {
                setOpenRouterLimit(prev => {
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
                setOpenRouterLimit(prev => {
                  if (prev === 5) return 10;
                  if (prev === 10) return 20;
                  // If already at 20, open external page
                  window.open('https://openrouter.ai/models', '_blank', 'noopener,noreferrer');
                  return prev;
                });
              }}
              className="hover:text-neutral-800 transition-colors flex items-center gap-1"
            >
              ▼ show more
            </button>
          </div>
        </div>

        {/* Card 2: Hugging Face – Daily Papers */}
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
                  <div
                    key={`${arxivId || title}-${rank}`}
                    className="group flex items-center justify-between gap-4 py-2.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary cursor-pointer transition-colors"
                    onClick={() => {
                      if (url) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {/* Left */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-5 text-[11px] font-semibold text-neutral-400 text-right mt-0.5">
                        {rank}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs md:text-sm font-semibold text-primary-700 dark:text-dark-accent-primary-bg truncate">
                          {title}
                        </div>
                        <div className="text-[9px] text-neutral-500">
                          {arxivId && <>Arxiv: {arxivId} · </>}
                          {numAuthors ? `${numAuthors} authors · ` : ''}
                          {submitter && <>by {submitter}</>}
                        </div>
                      </div>
                    </div>
                    {/* Right */}
                    <div className="text-right text-[8px] text-neutral-500">
                      <div className="font-semibold text-emerald-400">
                        ♥ {likes}
                      </div>
                      {comments > 0 && (
                        <div>Comments {comments}</div>
                      )}
                      {showCollections && (
                        <div>Collections {collections}</div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Show more / less */}
          <div className="mt-2 flex items-center justify-between text-[9px] text-neutral-500">
            <button
              type="button"
              onClick={() =>
                setPapersLimit((prev) => Math.max(10, prev - 10))
              }
              className="hover:text-neutral-800 transition-colors flex items-center gap-1"
            >
              ▲ show less
            </button>
            <button
              type="button"
              onClick={() =>
                setPapersLimit((prev) => {
                  const next = prev + 10;
                  if (next <= 20) {
                    return next;
                  }
                  // Nếu đã vượt 20, forward sang trang Daily Papers
                  window.open('https://huggingface.co/papers', '_blank', 'noopener,noreferrer');
                  return prev;
                })
              }
              className="hover:text-neutral-800 transition-colors flex items-center gap-1"
            >
              ▼ show more
            </button>
          </div>
        </div>
      </div>

        {/* NOTE: Removed legacy "Khám phá thêm" quick-links grid here to avoid JSX duplication issues */}

      {/* Features Section - New */}
      <div className="bg-neutral-50 dark:bg-[#020817] rounded-3xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Tại sao chọn Tech Digest Vietnam?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-dark-accent-primary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-dark-accent-primary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Đáng tin cậy</h3>
            <p className="text-secondary text-sm">Thông tin được kiểm chứng và cập nhật chính xác</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-dark-accent-emerald/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-dark-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Cập nhật thường xuyên</h3>
            <p className="text-secondary text-sm">Thông tin mới được cập nhật hàng ngày</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-dark-accent-secondary-bg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-dark-accent-secondary-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Dễ đọc</h3>
            <p className="text-secondary text-sm">Giao diện thân thiện và dễ sử dụng</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-dark-accent-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-dark-accent-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-primary mb-2">Chuyên sâu</h3>
            <p className="text-secondary text-sm">Phân tích chi tiết về công nghệ Việt Nam</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
