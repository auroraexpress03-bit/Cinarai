import type { AiProvider, AiProviderConfig, AiRequestPayload, AiResponse } from './provider';

function createProviderError(message: string, statusCode?: number): Error & { statusCode?: number } {
  const error = new Error(message) as Error & { statusCode?: number };
  if (typeof statusCode === 'number') {
    error.statusCode = statusCode;
  }
  return error;
}

export class GroqProvider implements AiProvider {
  public readonly name = 'groq' as const;

  constructor(private readonly config: AiProviderConfig = {}) {}

  async generate(payload: AiRequestPayload): Promise<AiResponse> {
    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw createProviderError('GROQ_API_KEY is not configured');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model ?? 'llama-3.3-70b-versatile',
        temperature: payload.temperature ?? 0.7,
        max_tokens: payload.maxTokens ?? 220,
        messages: [
          ...(payload.systemPrompt ? [{ role: 'system', content: payload.systemPrompt }] : []),
          { role: 'user', content: payload.prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw createProviderError(`HTTP ${response.status}: ${errorText || response.statusText}`, response.status);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
    };

    const content = typeof data.choices?.[0]?.message?.content === 'string'
      ? data.choices[0].message.content
      : Array.isArray(data.choices?.[0]?.message?.content)
        ? data.choices[0].message.content.map((part) => part.text ?? '').join('')
        : '';

    if (!content?.trim()) {
      throw createProviderError('Groq returned empty content');
    }

    return {
      provider: this.name,
      content,
      raw: data,
    };
  }
}
