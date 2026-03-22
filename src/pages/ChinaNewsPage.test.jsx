import React from 'react';
import { render, screen } from '@testing-library/react';

const mockUseLatestChinaNewsReport = jest.fn();

jest.mock('../hooks/useChinaNewsReport', () => ({
  useLatestChinaNewsReport: () => mockUseLatestChinaNewsReport(),
}), { virtual: true });

jest.mock('../components/WeeklyTechReportView', () => (props) => (
  <div data-testid="china-news-viewer">
    <span>{props.contentType}</span>
    <span>{props.report?.filename}</span>
  </div>
));

import ChinaNewsPage from './ChinaNewsPage';

describe('ChinaNewsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    mockUseLatestChinaNewsReport.mockReturnValue({
      report: {
        filename: 'shawn-weekly-2026-03-15.vi.md',
        upload_date: '2026-03-22T03:00:00.000Z',
        content: '# Ban tin Shawn Weekly',
      },
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    mockUseLatestChinaNewsReport.mockReset();
  });

  test('renders the shared report viewer with china-news content type', () => {
    render(<ChinaNewsPage />);

    expect(screen.getByTestId('china-news-viewer')).toBeInTheDocument();
    expect(screen.getByText('china-news')).toBeInTheDocument();
    expect(screen.getByText('shawn-weekly-2026-03-15.vi.md')).toBeInTheDocument();
  });
});
