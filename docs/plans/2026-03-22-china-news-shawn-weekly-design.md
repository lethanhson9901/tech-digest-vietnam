# China News Shawn Weekly Frontend Design

**Date:** 2026-03-22

**Goal:** Redesign the `/china-news` page so it matches the report-reading experience of `/weekly-tech-reports`, while preserving the existing route and updating the branding/content semantics for Shawn Weekly.

## Context

The frontend currently has two very different implementations:

- `/weekly-tech-reports` uses a thin page layer plus `WeeklyTechReportView`, which expects a single report object and renders a long-form Markdown reading experience.
- `/china-news` still assumes the backend returns a stitched multi-source digest with `[SOURCE]` markers and renders 11 cards through `ChinaNewsSection`.

The backend has now changed. `/china-news/latest` returns a single translated Shawn Weekly report, which means the current frontend no longer matches the response shape or the content model.

## Decision

Keep the `/china-news` route, but replace its UI flow with the same architecture used by `/weekly-tech-reports`.

This means:

- stop parsing `[SOURCE]` blocks on the client
- stop rendering `ChinaNewsSection` on `/china-news`
- fetch the latest report as a single document
- render it through `WeeklyTechReportView`

## Architecture

### Data flow

1. A new China News hook fetches the latest report from `fetchLatestChinaNews()`
2. `ChinaNewsPage.jsx` becomes a thin container page
3. The page renders `WeeklyTechReportView` with `contentType="china-news"`
4. `WeeklyTechReportView` provides the existing polished reading experience while switching labels and metadata for the China News / Shawn Weekly context

### Viewer behavior

`WeeklyTechReportView` remains the shared reader component. It should gain a `china-news` content type branch for:

- display name: `Shawn Weekly`
- sublabel: `Bản dịch tiếng Việt từ Shawn Weekly`
- archive path handling: keep existing back-navigation behavior; do not invent a fake archive flow
- filename/title normalization for `shawn-weekly-YYYY-MM-DD.vi.md`

## Scope

### Files likely to change

- `src/pages/ChinaNewsPage.jsx`
- `src/hooks/useChinaNewsReport.js`
- `src/components/WeeklyTechReportView.jsx`
- `src/services/api.js` only if minor naming cleanup is needed

### Files not required for this pass

- `src/components/ChinaNewsSection.jsx`
- header navigation structure
- backend API contract

`ChinaNewsSection.jsx` can remain in the repository for now as unused code to avoid widening the change set.

## UX Direction

The `/china-news` page should look and behave almost the same as `/weekly-tech-reports`, but with Shawn Weekly branding. That means:

- same long-form reader layout
- same reading progress bar
- same header and content card structure
- no old grid of source cards
- no misleading references to “11 sources” or “cập nhật hàng ngày”

## Verification

Because the frontend test baseline is thin, verification should focus on:

- one targeted smoke test that renders `/china-news` with mocked report data
- one assertion that Shawn Weekly branding appears
- one assertion that report Markdown content renders
- a production build to catch route/import regressions

## Rollout

After deployment, `/china-news` will immediately present the translated Shawn Weekly report using the same reading experience as `/weekly-tech-reports`, with no backend API changes required.
