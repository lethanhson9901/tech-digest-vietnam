import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListViewReportsList from './ListViewReportsList';

jest.mock('./Pagination', () => () => <div>pagination</div>);
jest.mock('./LoadingSpinner', () => () => <div>loading</div>);
jest.mock('./ErrorMessage', () => ({ message }) => <div>{message}</div>);

describe('ListViewReportsList', () => {
  test('uses china-news detail routes for china-news archive items', () => {
    render(
      <MemoryRouter>
        <ListViewReportsList
          reports={[
            {
              id: 'china-1',
              filename: 'shawn-weekly-2026-03-22.vi.md',
              upload_date: '2026-03-28T01:00:00.000Z',
            },
          ]}
          totalCount={1}
          isLoading={false}
          error={null}
          params={{ skip: 0, limit: 10 }}
          updateParams={jest.fn()}
          contentType="china-news"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/china-news/china-1');
  });
});
