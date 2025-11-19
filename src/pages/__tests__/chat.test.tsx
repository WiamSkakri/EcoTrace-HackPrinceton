import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../chat';
import { useRouter } from 'next/router';
import * as openaiModule from '@/lib/openai';

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

// Mock OpenAI module
jest.mock('@/lib/openai', () => ({
  getOpenAIResponse: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Chat Page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/chat',
      push: jest.fn(),
    });

    // Mock data fetches with correct URLs
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/data/transactions.json') {
        return Promise.resolve({
          json: async () => [{ id: 1, amount: 100 }],
        });
      }
      if (url === '/data/brand.json') {
        return Promise.resolve({
          json: async () => [{ name: 'EcoBrand', score: 85 }],
        });
      }
      if (url === '/data/store.json') {
        return Promise.resolve({
          json: async () => [{ name: 'GreenStore', rating: 4.5 }],
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    jest.clearAllMocks();
  });

  it('should render welcome section before chat starts', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to Eco Chat!')).toBeInTheDocument();
    });
  });

  it('should display welcome text', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText(/I'm here to help you understand your environmental impact/i)).toBeInTheDocument();
    });
  });

  it('should render quick question buttons', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText('What is my carbon footprint?')).toBeInTheDocument();
      expect(screen.getByText('How can I reduce my environmental impact?')).toBeInTheDocument();
      expect(screen.getByText('Show me sustainable alternatives')).toBeInTheDocument();
      expect(screen.getByText('What are my worst purchases?')).toBeInTheDocument();
    });
  });

  it('should render input placeholder', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask about your sustainability/i)).toBeInTheDocument();
    });
  });

  it('should load transaction, brand, and store data on mount', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/data/transactions.json');
      expect(global.fetch).toHaveBeenCalledWith('/data/brand.json');
      expect(global.fetch).toHaveBeenCalledWith('/data/store.json');
    });
  });

  it('should have send button disabled when input is empty', async () => {
    render(<Chat />);

    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button');
      const sendButton = submitButtons.find(btn => btn.querySelector('svg'));
      expect(sendButton).toBeDisabled();
    });
  });

  it('should handle quick question click', async () => {
    const mockResponse = 'Here are some tips';
    (openaiModule.getOpenAIResponse as jest.Mock).mockResolvedValue(mockResponse);

    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByText('What is my carbon footprint?')).toBeInTheDocument();
    });

    const quickButton = screen.getByText('What is my carbon footprint?');
    fireEvent.click(quickButton);

    await waitFor(() => {
      expect(openaiModule.getOpenAIResponse).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should send message when form is submitted', async () => {
    const mockResponse = 'This is a sustainability tip';
    (openaiModule.getOpenAIResponse as jest.Mock).mockResolvedValue(mockResponse);

    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask about your sustainability/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Ask about your sustainability/i);

    fireEvent.change(input, { target: { value: 'How can I help?' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(openaiModule.getOpenAIResponse).toHaveBeenCalled();
    });
  });

  it('should not send empty messages', async () => {
    render(<Chat />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask about your sustainability/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Ask about your sustainability/i);
    const form = input.closest('form');

    if (form) {
      fireEvent.submit(form);
    }

    expect(openaiModule.getOpenAIResponse).not.toHaveBeenCalled();
  });

  it('should display loading placeholder when data is not loaded', () => {
    // Mock fetch to never resolve
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Chat />);

    expect(screen.getByPlaceholderText('Loading data...')).toBeInTheDocument();
  });

  it('should handle data loading errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<Chat />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
