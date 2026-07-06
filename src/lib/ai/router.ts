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

const RETRYABLE_ERROR_PATTERNS = [/quota/i, /timeout/i, /network/i, /rate limit/i, /rate-limit/i, /too many requests/i];

export class AiRouter {
  constructor(
    private readonly providers: AiProvider[],
    private readonly logger: Pick<Console, 'info' | 'warn'> = console,
  ) {}

  static createDefault(configs: Partial<Record<AiProviderName, AiProviderConfig>> = {}): AiRouter {
    const providers: AiProvider[] = [
      this.createProviderIfConfigured('gemini', configs.gemini),
      this.createProviderIfConfigured('groq', configs.groq),
      this.createProviderIfConfigured('openrouter', configs.openrouter),
      this.createProviderIfConfigured('openai', configs.openai),
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

    for (const provider of this.providers) {
      this.logger.info(`[ai-router] trying provider: ${provider.name}`);

      try {
        const response = await provider.generate(payload);
        logs.push({ provider: provider.name, status: 'success' });
        this.logger.info(`[ai-router] success with provider: ${provider.name}`);
        return response;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown error';
        logs.push({ provider: provider.name, status: 'failed', reason });
        this.logger.warn(`[ai-router] provider ${provider.name} failed: ${reason}`);

        if (!this.isRetryableError(reason)) {
          break;
        }
      }
    }

    const lastAttempt = logs[logs.length - 1];
    const friendlyMessage =
      'Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi sebentar lagi.';

    if (lastAttempt?.status === 'success') {
      return {
        provider: lastAttempt.provider,
        content: '',
      };
    }

    throw new AiRouterError(friendlyMessage, logs);
  }

  private isRetryableError(reason: string): boolean {
    return RETRYABLE_ERROR_PATTERNS.some((pattern) => pattern.test(reason));
  }
}
