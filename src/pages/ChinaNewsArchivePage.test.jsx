import React from 'react';
import { render, screen } from '@testing-library/react';

const mockUseChinaNewsReports = jest.fn();

jest.mock('../hooks/useChinaNewsReport', () => ({
  useChinaNewsReports: () => mockUseChinaNewsReports(),
}));

jest.mock('../components/SearchBar', () => () => <div>search-bar</div>);
jest.mock('../components/DateRangePicker', () => () => <div>date-range-picker</div>);
jest.mock('../components/LoadingSpinner', () => () => <div>loading</div>);
jest.mock('../components/ErrorMessage', () => ({ message }) => <div>{message}</div>);
jest.mock('../components/TagComponent', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ListViewReportsList', () => (props) => (
  <div data-testid="china-news-archive-list">{props.contentType}</div>
));

import ChinaNewsArchivePage from './ChinaNewsArchivePage';

describe('ChinaNewsArchivePage', () => {
  const fetchReports = jest.fn();

  beforeEach(() => {
    mockUseChinaNewsReports.mockReturnValue({
      reports: [{ id: '1', filename: 'shawn-weekly-2026-03-22.vi.md' }],
      total: 1,
      loading: false,
      error: null,
      fetchReports,
    });
  });

  afterEach(() => {
    mockUseChinaNewsReports.mockReset();
    fetchReports.mockReset();
  });

  test('renders the china news archive page with archive list content type', () => {
    render(<ChinaNewsArchivePage />);

    expect(screen.getByRole('heading', { name: /Tin Trung Quốc Archive/i })).toBeInTheDocument();
    expect(screen.getByTestId('china-news-archive-list')).toHaveTextContent('china-news');
  });

  test('fetches archive data once on initial render', () => {
    render(<ChinaNewsArchivePage />);

    expect(fetchReports).toHaveBeenCalledTimes(1);
    expect(fetchReports).toHaveBeenCalledWith({
      skip: 0,
      limit: 10,
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  });
});
