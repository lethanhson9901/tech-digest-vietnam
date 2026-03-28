import { fetchLatestWeeklyTechReport } from './api';

describe('fetchLatestWeeklyTechReport', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('bypasses cache when noCache is enabled', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ filename: 'issue-390.vi.md' }),
    });

    await fetchLatestWeeklyTechReport({ noCache: true });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://tech-digest-vietnam.vercel.app/weekly-tech-reports/latest?no-cache=1',
      {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      }
    );
  });
});
