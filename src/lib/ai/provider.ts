export type AiProviderName = 'gemini' | 'groq' | 'openrouter' | 'openai';

export interface AiRequestPayload {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface AiResponse {
  provider: AiProviderName;
  content: string;
  raw?: unknown;
}

export interface AiProvider {
  name: AiProviderName;
  generate(payload: AiRequestPayload): Promise<AiResponse>;
}

export interface AiProviderConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export function createAiProviderConfig(overrides: Partial<AiProviderConfig> = {}): AiProviderConfig {
  return {
    apiKey: overrides.apiKey,
    model: overrides.model,
    baseUrl: overrides.baseUrl,
  };
}
