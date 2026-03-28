# Weekly Tech Latest Cache Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add cache-bypass support to the latest Weekly Tech page so users can force-refresh the newest issue.

**Architecture:** Keep the backend unchanged and mirror the existing no-cache pattern already used by the generic latest report pages. The implementation is limited to the Weekly Tech API helper, hook, page wiring, and focused tests.

**Tech Stack:** React, React Router, Jest, Testing Library

---

### Task 1: Lock in API helper behavior

**Files:**
- Modify: `tech-digest-vietnam/src/services/api.js`
- Create: `tech-digest-vietnam/src/services/api.test.js`

**Step 1: Write the failing test**

Add a test asserting `fetchLatestWeeklyTechReport({ noCache: true })`:

- appends `?no-cache=1`
- passes `cache: 'no-store'`
- passes `Cache-Control: no-cache`

**Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watch=false src/services/api.test.js`

Expected: FAIL because the helper currently ignores the option.

### Task 2: Lock in page wiring behavior

**Files:**
- Modify: `tech-digest-vietnam/src/pages/LatestWeeklyTechReportPage.jsx`
- Modify: `tech-digest-vietnam/src/hooks/useWeeklyTechReports.js`
- Create: `tech-digest-vietnam/src/pages/LatestWeeklyTechReportPage.test.jsx`

**Step 1: Write the failing test**

Add a test asserting `/weekly-tech-reports?no-cache=1` causes the page to request the latest report with `{ noCache: true }`.

**Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watch=false src/pages/LatestWeeklyTechReportPage.test.jsx`

Expected: FAIL because the page currently ignores the query param.

### Task 3: Implement the minimal fix

**Files:**
- Modify: `tech-digest-vietnam/src/services/api.js`
- Modify: `tech-digest-vietnam/src/hooks/useWeeklyTechReports.js`
- Modify: `tech-digest-vietnam/src/pages/LatestWeeklyTechReportPage.jsx`

**Step 1: Implement API helper support**

- accept `{ noCache = false }`
- add `?no-cache=1` when enabled
- use fetch options `{ cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }`

**Step 2: Implement hook support**

- accept an optional config object in `useLatestWeeklyTechReport(...)`
- forward `noCache` into the API helper

**Step 3: Implement page wiring**

- read `no-cache` from `location.search`
- translate it into a boolean using the same logic as the generic latest page
- pass the flag into `useLatestWeeklyTechReport(...)`

### Task 4: Verify the fix

**Files:**
- Verify: `tech-digest-vietnam/src/services/api.js`
- Verify: `tech-digest-vietnam/src/hooks/useWeeklyTechReports.js`
- Verify: `tech-digest-vietnam/src/pages/LatestWeeklyTechReportPage.jsx`

**Step 1: Run focused tests**

Run:

`CI=true npm test -- --watch=false src/services/api.test.js src/pages/LatestWeeklyTechReportPage.test.jsx`

Expected: PASS

**Step 2: Run regression coverage**

Run:

`CI=true npm test -- --watch=false src/pages/LatestWeeklyTechReportPage.test.jsx src/pages/ChinaNewsPage.test.jsx src/hooks/useWeeklyTechReports.test.jsx src/App.test.js`

Expected: PASS

**Step 3: Run build**

Run:

`npm run build`

Expected: PASS
