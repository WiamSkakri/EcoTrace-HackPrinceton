import { render, screen, waitFor } from '@testing-library/react';
import Leaderboard from '../leaderboard';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Leaderboard Page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/leaderboard',
      push: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('should render page title and description', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ leaderboard: [], harmful_products_user_001: [] }),
    });

    render(<Leaderboard />);

    expect(screen.getByText('Global Sustainability Leaderboard')).toBeInTheDocument();
    expect(screen.getByText(/Track top community performers/i)).toBeInTheDocument();
  });

  it('should render leaderboard users when data is loaded', async () => {
    const mockData = {
      leaderboard: [
        { user_id: 'user_001', score: 95.5 },
        { user_id: 'user_002', score: 88.2 },
        { user_id: 'user_003', score: 82.7 },
      ],
      harmful_products_user_001: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('user_001')).toBeInTheDocument();
      expect(screen.getByText('95.50 points')).toBeInTheDocument();
      expect(screen.getByText('user_002')).toBeInTheDocument();
      expect(screen.getByText('88.20 points')).toBeInTheDocument();
    });
  });

  it('should display rank badges for top 3 users', async () => {
    const mockData = {
      leaderboard: [
        { user_id: 'user_001', score: 95.5 },
        { user_id: 'user_002', score: 88.2 },
        { user_id: 'user_003', score: 82.7 },
        { user_id: 'user_004', score: 75.0 },
      ],
      harmful_products_user_001: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    const { container } = render(<Leaderboard />);

    await waitFor(() => {
      const badges = container.querySelectorAll('[class*="rankBadge"]');
      expect(badges.length).toBe(4);

      // Check for gold, silver, bronze classes
      expect(badges[0]).toHaveClass(expect.stringMatching(/rankGold/));
      expect(badges[1]).toHaveClass(expect.stringMatching(/rankSilver/));
      expect(badges[2]).toHaveClass(expect.stringMatching(/rankBronze/));
    });
  });

  it('should render harmful products section', async () => {
    const mockData = {
      leaderboard: [],
      harmful_products_user_001: [
        {
          product_name: 'Plastic Water Bottle',
          brand: 'BrandA',
          store: 'StoreX',
          score: -15,
        },
        {
          product_name: 'Disposable Cup',
          brand: 'BrandB',
          store: 'StoreY',
          score: -10,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Plastic Water Bottle')).toBeInTheDocument();
      expect(screen.getByText('Disposable Cup')).toBeInTheDocument();
      expect(screen.getByText(/Brand: BrandA/i)).toBeInTheDocument();
      expect(screen.getByText(/Store: StoreX/i)).toBeInTheDocument();
    });
  });

  it('should display sustainability scores for products', async () => {
    const mockData = {
      leaderboard: [],
      harmful_products_user_001: [
        {
          product_name: 'Eco Product',
          brand: 'GreenBrand',
          store: 'EcoStore',
          score: 25,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText(/Sustainability Score:/i)).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  it('should handle fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<Leaderboard />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading leaderboard:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should render section headers correctly', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ leaderboard: [], harmful_products_user_001: [] }),
    });

    render(<Leaderboard />);

    expect(screen.getByText('Current rankings')).toBeInTheDocument();
    expect(screen.getByText('Improve your standing')).toBeInTheDocument();
    expect(screen.getByText(/Live snapshot of the strongest/i)).toBeInTheDocument();
    expect(screen.getByText(/Prioritize replacing the following/i)).toBeInTheDocument();
  });

  it('should handle empty data arrays', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ leaderboard: [], harmful_products_user_001: [] }),
    });

    const { container } = render(<Leaderboard />);

    await waitFor(() => {
      const leaderItems = container.querySelectorAll('[class*="leaderItem"]');
      const productCards = container.querySelectorAll('[class*="productCard"]');
      expect(leaderItems.length).toBe(0);
      expect(productCards.length).toBe(0);
    });
  });

  it('should apply negative class to products with negative scores', async () => {
    const mockData = {
      leaderboard: [],
      harmful_products_user_001: [
        {
          product_name: 'Bad Product',
          brand: 'BadBrand',
          store: 'BadStore',
          score: -20,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    const { container } = render(<Leaderboard />);

    await waitFor(() => {
      const productCard = container.querySelector('[class*="productCard"]');
      expect(productCard).toHaveClass(expect.stringMatching(/negative/));
    });
  });

  it('should apply positive class to products with positive scores', async () => {
    const mockData = {
      leaderboard: [],
      harmful_products_user_001: [
        {
          product_name: 'Good Product',
          brand: 'GoodBrand',
          store: 'GoodStore',
          score: 50,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    });

    const { container } = render(<Leaderboard />);

    await waitFor(() => {
      const productCard = container.querySelector('[class*="productCard"]');
      expect(productCard).toHaveClass(expect.stringMatching(/positive/));
    });
  });
});
