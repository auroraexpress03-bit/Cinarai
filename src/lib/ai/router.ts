import { GeminiProvider } from './gemini';
import { GroqProvider } from './groq';
import { OpenRouterProvider } from './openrouter';
import { OpenAIProvider } from './openai';
import type { AiProvider, AiProviderConfig, AiProviderName, AiRequestPayload, AiResponse } from './provider';

const PROVIDER_ENV_KEYS: Record<AiProviderName, string> = {
  gemini: 'GEMINI_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  openai: 'OPENAI_API_KEY',
};

const PROVIDER_DISPLAY_NAMES: Record<AiProviderName, string> = {
  gemini: 'Gemini',
  groq: 'Groq',
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
};

export interface AiRouterLogEntry {
  provider: AiProviderName;
  status: 'success' | 'failed';
  reason?: string;
}

export class AiRouterError extends Error {
  constructor(
    message: string,
    public readonly logs: AiRouterLogEntry[],
  ) {
    super(message);
    this.name = 'AiRouterError';
  }
}

export class AiRouter {
  constructor(
    private readonly providers: AiProvider[],
    private readonly logger: Pick<Console, 'info' | 'warn'> = console,
  ) {}

  static createDefault(configs: Partial<Record<AiProviderName, AiProviderConfig>> = {}): AiRouter {
    const providers: AiProvider[] = [
      this.createProviderIfConfigured('gemini', configs.gemini),
      this.createProviderIfConfigured('openai', configs.openai),
      this.createProviderIfConfigured('groq', configs.groq),
      this.createProviderIfConfigured('openrouter', configs.openrouter),
    ].filter((provider): provider is AiProvider => Boolean(provider));

    return new AiRouter(providers);
  }

  private static createProviderIfConfigured(
    providerName: AiProviderName,
    config?: AiProviderConfig,
  ): AiProvider | null {
    const envKey = PROVIDER_ENV_KEYS[providerName];
    const configuredKey = config?.apiKey ?? process.env[envKey]?.trim();

    if (!configuredKey) {
      return null;
    }

    const providerConfig = { ...config, apiKey: configuredKey };

    switch (providerName) {
      case 'gemini':
        return new GeminiProvider(providerConfig);
      case 'groq':
        return new GroqProvider(providerConfig);
      case 'openrouter':
        return new OpenRouterProvider(providerConfig);
      case 'openai':
        return new OpenAIProvider(providerConfig);
    }
  }

  async generate(payload: AiRequestPayload): Promise<AiResponse> {
    const logs: AiRouterLogEntry[] = [];

    if (this.providers.length === 0) {
      throw new AiRouterError('Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi sebentar lagi.', logs);
    }

    for (const provider of this.providers) {
      const displayName = PROVIDER_DISPLAY_NAMES[provider.name] ?? provider.name;
      this.logger.info(`[ai-router] Trying ${displayName}`);

      try {
        const response = await provider.generate(payload);
        if (!response?.content?.trim()) {
          throw new Error(`Provider ${provider.name} returned empty content`);
        }

        logs.push({ provider: provider.name, status: 'success' });
        this.logger.info(`[ai-router] Provider success: ${provider.name}`);
        return response;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown error';
        logs.push({ provider: provider.name, status: 'failed', reason });
        this.logger.warn(`[ai-router] Provider failed: ${provider.name} | reason=${reason}`);
      }
    }

    this.logger.warn('[ai-router] All providers failed.');

    throw new AiRouterError('Semua provider AI gagal.', logs);
  }
}
