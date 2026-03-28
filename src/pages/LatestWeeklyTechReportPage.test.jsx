import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockUseLatestWeeklyTechReport = jest.fn();

jest.mock('../hooks/useWeeklyTechReports', () => ({
  useLatestWeeklyTechReport: (...args) => mockUseLatestWeeklyTechReport(...args),
}));

jest.mock('../components/WeeklyTechReportView', () => (props) => (
  <div data-testid="weekly-tech-viewer">
    <span>{props.report?.filename}</span>
  </div>
));

import LatestWeeklyTechReportPage from './LatestWeeklyTechReportPage';

describe('LatestWeeklyTechReportPage', () => {
  beforeEach(() => {
    mockUseLatestWeeklyTechReport.mockReturnValue({
      report: {
        filename: 'issue-390.vi.md',
        content: '# Issue 390',
      },
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    mockUseLatestWeeklyTechReport.mockReset();
  });

  test('requests a no-cache fetch when the query param is present', () => {
    render(
      <MemoryRouter initialEntries={['/weekly-tech-reports?no-cache=1']}>
        <Routes>
          <Route path="/weekly-tech-reports" element={<LatestWeeklyTechReportPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockUseLatestWeeklyTechReport).toHaveBeenCalledWith({ noCache: true });
    expect(screen.getByTestId('weekly-tech-viewer')).toBeInTheDocument();
  });
});
