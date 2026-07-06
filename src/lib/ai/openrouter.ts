import type { AiProvider, AiProviderConfig, AiRequestPayload, AiResponse } from './provider';

export class OpenRouterProvider implements AiProvider {
  public readonly name = 'openrouter' as const;

  constructor(private readonly config: AiProviderConfig = {}) {}

  async generate(payload: AiRequestPayload): Promise<AiResponse> {
    return {
      provider: this.name,
      content: '',
      raw: {
        prompt: payload.prompt,
        systemPrompt: payload.systemPrompt,
        model: this.config.model ?? 'openrouter/auto',
      },
    };
  }
}
