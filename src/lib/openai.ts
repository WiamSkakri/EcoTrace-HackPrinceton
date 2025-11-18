import OpenAI from 'openai';

export async function getOpenAIResponse(
  question: string,
  transactionsData: any,
  brandsData: any,
  storesData: any
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing OpenAI API Key');
    return 'Missing API key. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment.';
  }

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const transactionsJson = JSON.stringify(transactionsData, null, 2);
  const brandsJson = JSON.stringify(brandsData, null, 2);
  const storesJson = JSON.stringify(storesData, null, 2);

  const prompt = `
  I am here to give you insights regarding your sustainable practices and how you can improve them.
  Please respond in plain text only, with no Markdown formatting or asterisks.
  Provide a concise, direct answer unless further elaboration is requested.

  Below is my transaction data in JSON format:
  ${transactionsJson}

  Below is my brand data in JSON format:
  ${brandsJson}

  Below is my store data in JSON format:
  ${storesJson}

  Based on this data, please answer the following question in plain text (no asterisks or Markdown formatting):
  ${question}
  `;

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
    });

    if ('output_text' in response && response.output_text) {
      return response.output_text;
    }

    const text = response.output
      ?.flatMap((item: any) => item.content ?? [])
      ?.map((content: any) => content.text?.value ?? '')
      ?.join('')
      ?.trim();

    return text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Sorry, I had trouble connecting to the AI service. Please check your API key and internet connection.';
  }
}
