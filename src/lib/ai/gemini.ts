import type { AiProvider, AiProviderConfig, AiRequestPayload, AiResponse } from './provider';

export class GeminiProvider implements AiProvider {
  public readonly name = 'gemini' as const;

  constructor(private readonly config: AiProviderConfig = {}) {}

  async generate(payload: AiRequestPayload): Promise<AiResponse> {
    return {
      provider: this.name,
      content: '',
      raw: {
        prompt: payload.prompt,
        systemPrompt: payload.systemPrompt,
        model: this.config.model ?? 'gemini-pro',
      },
    };
  }
}
