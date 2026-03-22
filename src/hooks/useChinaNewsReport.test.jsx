import { renderHook, waitFor } from '@testing-library/react';
import { useLatestChinaNewsReport } from './useChinaNewsReport';
import { fetchLatestChinaNews } from '../services/api';

jest.mock('../services/api', () => ({
  fetchLatestChinaNews: jest.fn(),
}));

describe('useLatestChinaNewsReport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads the latest china news report successfully', async () => {
    fetchLatestChinaNews.mockResolvedValue({
      filename: 'shawn-weekly-2026-03-15.vi.md',
      upload_date: '2026-03-22T03:00:00.000Z',
      content: '# Ban tin Shawn Weekly',
    });

    const { result } = renderHook(() => useLatestChinaNewsReport());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.report?.filename).toBe('shawn-weekly-2026-03-15.vi.md');
  });

  test('exposes api errors', async () => {
    fetchLatestChinaNews.mockRejectedValue(new Error('API error: 500'));

    const { result } = renderHook(() => useLatestChinaNewsReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.report).toBe(null);
    expect(result.current.error).toBe('API error: 500');
  });
});
