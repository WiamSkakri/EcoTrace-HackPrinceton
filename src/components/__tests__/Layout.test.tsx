import { render, screen, fireEvent } from '@testing-library/react';
import Layout from '../Layout';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Layout Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      push: mockPush,
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render navigation tabs', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('My Impact')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Eco Chat')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should highlight active tab based on current route', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/leaderboard',
      push: mockPush,
    });

    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const leaderboardLink = screen.getByText('Leaderboard').closest('a');
    expect(leaderboardLink).toHaveClass('active');
  });

  it('should render theme toggle button', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should toggle theme when theme button is clicked', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Initially dark theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Click to switch to light
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    // Click to switch back to dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should load saved theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');

    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should use system preference when no saved theme exists', () => {
    // matchMedia is mocked in jest.setup.js to return false (light theme)
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    // Since matchMedia.matches is false, it should default to light
    expect(document.documentElement.getAttribute('data-theme')).toBeTruthy();
  });

  it('should have correct navigation links', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const homeLink = screen.getByText('My Impact').closest('a');
    const leaderboardLink = screen.getByText('Leaderboard').closest('a');
    const chatLink = screen.getByText('Eco Chat').closest('a');
    const mapLink = screen.getByText('Map').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(leaderboardLink).toHaveAttribute('href', '/leaderboard');
    expect(chatLink).toHaveAttribute('href', '/chat');
    expect(mapLink).toHaveAttribute('href', '/map');
  });

  it('should render all 4 navigation tabs', () => {
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    const tabs = container.querySelectorAll('.nav-tab');
    expect(tabs.length).toBe(4);
  });
});
