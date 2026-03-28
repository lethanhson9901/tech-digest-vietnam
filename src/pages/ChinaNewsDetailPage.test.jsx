import React from 'react';
import { render, screen } from '@testing-library/react';

const mockUseChinaNewsReport = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'china-1' }),
}));

jest.mock('../hooks/useChinaNewsReport', () => ({
  useChinaNewsReport: () => mockUseChinaNewsReport(),
}));

jest.mock('../components/WeeklyTechReportView', () => (props) => (
  <div data-testid="china-news-detail-view">
    <span>{props.contentType}</span>
    <span>{props.report?.filename}</span>
  </div>
));

import ChinaNewsDetailPage from './ChinaNewsDetailPage';

describe('ChinaNewsDetailPage', () => {
  beforeEach(() => {
    mockUseChinaNewsReport.mockReturnValue({
      report: {
        filename: 'shawn-weekly-2026-03-22.vi.md',
        content: '# Ban tin',
      },
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    mockUseChinaNewsReport.mockReset();
  });

  test('renders the shared report viewer with china-news content type', () => {
    render(<ChinaNewsDetailPage />);

    expect(screen.getByTestId('china-news-detail-view')).toBeInTheDocument();
    expect(screen.getByText('china-news')).toBeInTheDocument();
    expect(screen.getByText('shawn-weekly-2026-03-22.vi.md')).toBeInTheDocument();
  });
});
