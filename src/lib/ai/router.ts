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

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];
const RETRYABLE_ERROR_PATTERNS = [/quota/i, /timeout/i, /network/i, /rate limit/i, /rate-limit/i, /too many requests/i, /429/i, /5\d\d/i];
const NON_RETRYABLE_ERROR_PATTERNS = [/prompt/i, /invalid/i, /bad request/i, /400/i, /401/i, /403/i, /404/i, /unsupported/i, /format/i, /malformed/i];

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

    if (this.providers.length === 0) {
      throw new AiRouterError('Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi sebentar lagi.', logs);
    }

    for (const provider of this.providers) {
      this.logger.info(`[ai-router] provider selected: ${provider.name}`);

      try {
        const response = await provider.generate(payload);
        if (!response?.content?.trim()) {
          throw new Error(`Provider ${provider.name} returned empty content`);
        }

        logs.push({ provider: provider.name, status: 'success' });
        this.logger.info(`[ai-router] provider success: ${provider.name}`);
        return response;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown error';
        logs.push({ provider: provider.name, status: 'failed', reason });
        this.logger.warn(`[ai-router] provider failed: ${provider.name} | reason=${reason}`);

        if (this.isRetryableError(error)) {
          this.logger.info(`[ai-router] trying next provider after ${provider.name}`);
          continue;
        }

        this.logger.warn(`[ai-router] stopping router because ${provider.name} failed with a non-retryable error`);
        break;
      }
    }

    const friendlyMessage =
      'Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi sebentar lagi.';

    throw new AiRouterError(friendlyMessage, logs);
  }

  private isRetryableError(error: unknown): boolean {
    const reason = error instanceof Error ? error.message : String(error);
    const statusCode = typeof (error as { statusCode?: unknown }).statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : undefined;

    if (statusCode && RETRYABLE_STATUS_CODES.includes(statusCode)) {
      return true;
    }

    if (NON_RETRYABLE_ERROR_PATTERNS.some((pattern) => pattern.test(reason))) {
      return false;
    }

    return RETRYABLE_ERROR_PATTERNS.some((pattern) => pattern.test(reason));
  }
}
