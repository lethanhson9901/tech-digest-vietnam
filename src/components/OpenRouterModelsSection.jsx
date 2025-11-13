import React, { useState, useEffect, memo } from 'react';
import OpenRouterIcon from './OpenRouterIcon';

const OpenRouterModelsSection = () => {
  const [openRouterModels, setOpenRouterModels] = useState([]);
  const [openRouterLoading, setOpenRouterLoading] = useState(false);
  const [openRouterError, setOpenRouterError] = useState(null);
  const [openRouterLimit, setOpenRouterLimit] = useState(5);

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

  return (
    <div className="bg-white dark:bg-[#020817] rounded-3xl shadow-lg border border-neutral-200 dark:border-[#1f2937] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
            <OpenRouterIcon className="text-sky-600 dark:text-sky-400" size={20} />
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
              <OpenRouterModelItem
                key={`${id}-${rank}`} // Using id and rank as key
                rank={rank}
                name={name}
                truncatedDescription={truncatedDescription}
                ctx={ctx}
                raw={model.raw}
                url={url}
                unit={unit}
              />
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
  );
};

const OpenRouterModelItem = memo(({ rank, name, truncatedDescription, ctx, raw, url, unit }) => {
  return (
    <div
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
            {raw?.architecture?.modality && (
              <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-[8px] text-blue-700 dark:text-blue-300">
                {raw.architecture.modality}
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
});

export default OpenRouterModelsSection;