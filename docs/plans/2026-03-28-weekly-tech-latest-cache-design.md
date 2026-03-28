# Weekly Tech Latest Cache Design

## Goal

Make the latest Weekly Tech page reliably fetch the newest report when cache bypass is requested, without changing the backend API contract.

## Current State

- The backend live endpoint `/weekly-tech-reports/latest` already returns the newest report.
- The frontend latest Weekly Tech page calls `fetch('/weekly-tech-reports/latest')` with default browser caching behavior.
- Other latest pages already support `?no-cache=1` with `cache: 'no-store'`.

## Design

Reuse the existing pattern from the generic latest report pages:

- extend `fetchLatestWeeklyTechReport(...)` to accept `{ noCache }`
- when `noCache` is enabled, send `cache: 'no-store'` and `Cache-Control: no-cache`
- let `useLatestWeeklyTechReport(...)` accept the same option and pass it through
- update `LatestWeeklyTechReportPage` to read `?no-cache=1` from the URL and request the latest report with cache bypass

## Verification

- unit test that `fetchLatestWeeklyTechReport({ noCache: true })` calls `fetch` with no-store options
- unit test that `LatestWeeklyTechReportPage` forwards the query-param intent into the hook
- focused frontend tests for the new behavior
