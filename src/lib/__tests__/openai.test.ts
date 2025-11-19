import { getOpenAIResponse } from '../openai';

// Mock OpenAI module
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    responses: {
      create: jest.fn(),
    },
  }));
});

import OpenAI from 'openai';

describe('OpenAI Integration', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'test-openai-key';

    // Get the mock create function
    const OpenAIMock = OpenAI as jest.MockedClass<typeof OpenAI>;
    const instance = new OpenAIMock({ apiKey: 'test' });
    mockCreate = instance.responses.create as jest.Mock;
  });

  it('should return error message when API key is missing', async () => {
    delete process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const result = await getOpenAIResponse('test question', {}, {}, {});

    expect(result).toBe('Missing API key. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment.');
  });

  it('should successfully call OpenAI API and return response', async () => {
    const mockResponse = {
      output_text: 'This is a test response about sustainability',
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await getOpenAIResponse(
      'How can I be more sustainable?',
      [{ id: 1, amount: 100 }],
      [{ name: 'EcoBrand' }],
      [{ name: 'GreenStore' }]
    );

    expect(result).toBe('This is a test response about sustainability');
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-4o-mini',
      input: expect.stringContaining('How can I be more sustainable?'),
    });
  });

  it('should handle response with output array structure', async () => {
    const mockResponse = {
      output: [
        {
          content: [
            { text: { value: 'First part ' } },
            { text: { value: 'Second part' } },
          ],
        },
      ],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await getOpenAIResponse('test', {}, {}, {});

    expect(result).toBe('First part Second part');
  });

  it('should return fallback message when response is empty', async () => {
    const mockResponse = {
      output: [],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await getOpenAIResponse('test', {}, {}, {});

    expect(result).toBe('Sorry, I could not generate a response.');
  });

  it('should handle API errors gracefully', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    const result = await getOpenAIResponse('test', {}, {}, {});

    expect(result).toBe('Sorry, I had trouble connecting to the AI service. Please check your API key and internet connection.');
  });

  it('should include transaction, brand, and store data in prompt', async () => {
    const mockResponse = { output_text: 'response' };
    mockCreate.mockResolvedValue(mockResponse);

    const transactions = [{ id: 1, amount: 50 }];
    const brands = [{ name: 'EcoBrand', score: 85 }];
    const stores = [{ name: 'GreenMart', rating: 4.5 }];

    await getOpenAIResponse('Question', transactions, brands, stores);

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.input).toContain(JSON.stringify(transactions, null, 2));
    expect(callArgs.input).toContain(JSON.stringify(brands, null, 2));
    expect(callArgs.input).toContain(JSON.stringify(stores, null, 2));
  });

  it('should use correct model', async () => {
    const mockResponse = { output_text: 'response' };
    mockCreate.mockResolvedValue(mockResponse);

    await getOpenAIResponse('test', {}, {}, {});

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
      })
    );
  });

  it('should request plain text without markdown in prompt', async () => {
    const mockResponse = { output_text: 'response' };
    mockCreate.mockResolvedValue(mockResponse);

    await getOpenAIResponse('test', {}, {}, {});

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.input).toContain('plain text only');
    expect(callArgs.input).toContain('no Markdown formatting');
  });
});
