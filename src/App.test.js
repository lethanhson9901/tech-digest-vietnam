import { render, screen } from '@testing-library/react';

jest.mock('./components/MarkdownRenderer', () => () => <div>markdown-renderer</div>);

import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('renders the application shell', () => {
    render(<App />);

    expect(screen.getByText(/Tech Digest Vietnam/i)).toBeInTheDocument();
  });
});
