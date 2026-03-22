# China News Shawn Weekly Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `/china-news` as a single-report Shawn Weekly reading page using the existing `WeeklyTechReportView` flow instead of the legacy 11-source China News layout.

**Architecture:** Replace the current China News page logic with a thin page and hook that fetch the latest China News report, then render it through `WeeklyTechReportView` using a new `china-news` content type branch. Keep the route unchanged and avoid introducing a new viewer component unless the shared viewer proves insufficient.

**Tech Stack:** React 18, react-router-dom, react-scripts, React Testing Library, Jest

---

### Task 1: Lock in the new `/china-news` page behavior with a failing test

**Files:**
- Create: `src/pages/ChinaNewsPage.test.jsx`
- Modify: `src/pages/ChinaNewsPage.jsx`
- Test: `src/pages/ChinaNewsPage.test.jsx`

**Step 1: Write the failing test**

Create a focused page test that mocks the China News hook and verifies the new report-view behavior:

```jsx
jest.mock('../hooks/useChinaNewsReport', () => ({
  useLatestChinaNewsReport: () => ({
    report: {
      filename: 'shawn-weekly-2026-03-15.vi.md',
      upload_date: '2026-03-22T03:00:00.000Z',
      content: '# Ban tin Shawn Weekly'
    },
    loading: false,
    error: null
  })
}));

test('renders China News page with Shawn Weekly viewer branding', () => {
  renderWithRouter(<ChinaNewsPage />);
  expect(screen.getByText(/Shawn Weekly/i)).toBeInTheDocument();
  expect(screen.getByText(/Ban tin Shawn Weekly/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx
```

Expected: FAIL because the current page still renders the legacy source-card layout and does not use a China News report hook.

**Step 3: Write minimal implementation**

Refactor `src/pages/ChinaNewsPage.jsx` into a thin page:

```jsx
import WeeklyTechReportView from '../components/WeeklyTechReportView';
import { useLatestChinaNewsReport } from '../hooks/useChinaNewsReport';

const ChinaNewsPage = () => {
  const { report, loading, error } = useLatestChinaNewsReport();
  return (
    <WeeklyTechReportView
      report={report}
      isLoading={loading}
      error={error}
      contentType="china-news"
    />
  );
};
```

**Step 4: Run test to verify it passes**

Run:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/ChinaNewsPage.jsx src/pages/ChinaNewsPage.test.jsx
git commit -m "feat: switch china news page to report viewer"
```

### Task 2: Add the China News hook with TDD

**Files:**
- Create: `src/hooks/useChinaNewsReport.js`
- Create: `src/hooks/useChinaNewsReport.test.jsx`
- Modify: `src/services/api.js`
- Test: `src/hooks/useChinaNewsReport.test.jsx`

**Step 1: Write the failing test**

Create a hook test that mocks `fetchLatestChinaNews` and verifies:

- loading starts and resolves
- successful fetch stores the report
- API errors surface through `error`

Example expectation:

```jsx
expect(result.current.loading).toBe(false);
expect(result.current.report.filename).toBe('shawn-weekly-2026-03-15.vi.md');
```

**Step 2: Run test to verify it fails**

Run:

```bash
CI=true npm test -- --watch=false src/hooks/useChinaNewsReport.test.jsx
```

Expected: FAIL because the hook file does not exist yet.

**Step 3: Write minimal implementation**

Add `src/hooks/useChinaNewsReport.js` following the `useLatestWeeklyTechReport` pattern:

```jsx
export const useLatestChinaNewsReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  ...
};
```

Keep `src/services/api.js` fetch functions stable unless a small cleanup is required.

**Step 4: Run test to verify it passes**

Run:

```bash
CI=true npm test -- --watch=false src/hooks/useChinaNewsReport.test.jsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useChinaNewsReport.js src/hooks/useChinaNewsReport.test.jsx src/services/api.js
git commit -m "feat: add latest china news hook"
```

### Task 3: Extend the shared viewer for `china-news`

**Files:**
- Modify: `src/components/WeeklyTechReportView.jsx`
- Modify: `src/pages/ChinaNewsPage.test.jsx`
- Test: `src/pages/ChinaNewsPage.test.jsx`

**Step 1: Write the failing test**

Add assertions proving the viewer shows China News specific labels:

```jsx
expect(screen.getByText(/Shawn Weekly/i)).toBeInTheDocument();
expect(screen.getByText(/Bản dịch tiếng Việt từ Shawn Weekly/i)).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx
```

Expected: FAIL because `WeeklyTechReportView` does not yet recognize `contentType="china-news"`.

**Step 3: Write minimal implementation**

Update `WeeklyTechReportView.jsx` maps and text branches:

- add `china-news` to `getContentTypeName`
- add `china-news` to any content description helper
- normalize filename display for `shawn-weekly-*.vi.md`
- avoid misleading weekly-tech wording in the content header

Use the smallest possible change set inside the shared viewer.

**Step 4: Run test to verify it passes**

Run:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/WeeklyTechReportView.jsx src/pages/ChinaNewsPage.test.jsx
git commit -m "feat: add china news branding to shared viewer"
```

### Task 4: Verify route integration and keep scope tight

**Files:**
- Modify: `src/App.jsx` only if route wiring needs a small import cleanup
- Leave: `src/components/ChinaNewsSection.jsx`
- Test: `src/App.test.js` or a small route smoke test if needed

**Step 1: Write the failing test**

If route-level coverage is missing, add a minimal smoke test that renders the app at `/china-news` and ensures it does not crash under mocked data.

**Step 2: Run test to verify it fails**

Run:

```bash
CI=true npm test -- --watch=false src/App.test.js
```

Expected: likely FAIL or be irrelevant until the mock/setup is updated.

**Step 3: Write minimal implementation**

Only make route-level changes if needed:

- keep `/china-news` pointing to `ChinaNewsPage`
- do not widen scope into archive work
- do not delete `ChinaNewsSection.jsx` in this pass unless it blocks the build

**Step 4: Run test to verify it passes**

Run:

```bash
CI=true npm test -- --watch=false src/App.test.js src/pages/ChinaNewsPage.test.jsx src/hooks/useChinaNewsReport.test.jsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/App.jsx src/App.test.js src/pages/ChinaNewsPage.test.jsx src/hooks/useChinaNewsReport.test.jsx
git commit -m "test: cover china news route smoke path"
```

### Task 5: Final verification

**Files:**
- Modify: `src/pages/ChinaNewsPage.jsx`
- Modify: `src/hooks/useChinaNewsReport.js`
- Modify: `src/components/WeeklyTechReportView.jsx`
- Test: `src/pages/ChinaNewsPage.test.jsx`
- Test: `src/hooks/useChinaNewsReport.test.jsx`

**Step 1: Write the failing test**

Use the focused tests from the earlier tasks as the safety net. Add no new tests unless the implementation exposes a missing behavior gap.

**Step 2: Run test to verify it fails**

Run the focused suite first if any task is still red:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx src/hooks/useChinaNewsReport.test.jsx
```

Expected: all intended tests are green before the final build.

**Step 3: Write minimal implementation**

Finish any remaining cleanup, remove dead imports, and ensure the page renders the latest China News report with Shawn Weekly branding.

**Step 4: Run test to verify it passes**

Run:

```bash
CI=true npm test -- --watch=false src/pages/ChinaNewsPage.test.jsx src/hooks/useChinaNewsReport.test.jsx
npm run build
```

Expected: tests pass and the frontend production build succeeds.

**Step 5: Commit**

```bash
git add src/pages/ChinaNewsPage.jsx src/components/WeeklyTechReportView.jsx src/hooks/useChinaNewsReport.js src/hooks/useChinaNewsReport.test.jsx src/pages/ChinaNewsPage.test.jsx src/App.test.js docs/plans/2026-03-22-china-news-shawn-weekly-design.md docs/plans/2026-03-22-china-news-shawn-weekly-implementation.md
git commit -m "feat: redesign china news page for Shawn Weekly"
```
