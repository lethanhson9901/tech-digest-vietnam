import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WeeklyTechReportView from './WeeklyTechReportView';

jest.mock('./MarkdownRenderer', () => ({ content }) => <div>{content}</div>);
jest.mock('./SocialLinks', () => () => <div>social-links</div>);

describe('WeeklyTechReportView', () => {
  test('renders Shawn Weekly branding for china-news content', () => {
    render(
      <MemoryRouter>
        <WeeklyTechReportView
          report={{
            filename: 'shawn-weekly-2026-03-15.vi.md',
            upload_date: '2026-03-22T03:00:00.000Z',
            content: '# Ban tin Shawn Weekly',
          }}
          isLoading={false}
          error={null}
          contentType="china-news"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Shawn Weekly' })).toBeInTheDocument();
    expect(screen.getByText('Bản dịch tiếng Việt từ Shawn Weekly')).toBeInTheDocument();
    expect(screen.getByText('# Ban tin Shawn Weekly')).toBeInTheDocument();
    expect(screen.getByText('Xem thêm')).toBeInTheDocument();
  });
});
