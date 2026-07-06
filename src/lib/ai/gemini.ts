import type { AiProvider, AiProviderConfig, AiRequestPayload, AiResponse } from './provider';

function createProviderError(message: string, statusCode?: number): Error & { statusCode?: number } {
  const error = new Error(message) as Error & { statusCode?: number };
  if (typeof statusCode === 'number') {
    error.statusCode = statusCode;
  }
  return error;
}

export class GeminiProvider implements AiProvider {
  public readonly name = 'gemini' as const;

  constructor(private readonly config: AiProviderConfig = {}) {}

  async generate(payload: AiRequestPayload): Promise<AiResponse> {
    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) {
      throw createProviderError('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model ?? 'gemini-2.0-flash'}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${payload.systemPrompt ? `${payload.systemPrompt}\n\n` : ''}${payload.prompt}` }],
            },
          ],
          generationConfig: {
            temperature: payload.temperature ?? 0.7,
            maxOutputTokens: payload.maxTokens ?? 220,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw createProviderError(`HTTP ${response.status}: ${errorText || response.statusText}`, response.status);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

    if (!content) {
      throw createProviderError('Gemini returned empty content');
    }

    return {
      provider: this.name,
      content,
      raw: data,
    };
  }
}
