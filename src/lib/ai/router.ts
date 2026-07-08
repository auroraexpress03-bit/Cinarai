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
    private readonly logger: Pick<Console, 'info' | 'warn' | 'error'> = console,
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
      this.logger.error('[ai-router] No AI providers configured.');
      this.logger.error('[ai-router] Checked environment variables: GEMINI_API_KEY, OPENAI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY');
      throw new AiRouterError('Seluruh layanan AI sedang tidak tersedia.', logs);
    }

    for (const [index, provider] of this.providers.entries()) {
      const displayName = PROVIDER_DISPLAY_NAMES[provider.name] ?? provider.name;
      const providerLabel = displayName;
      this.logger.info(`[AI Router] router -> ${providerLabel}`);
      this.logger.info(`[AI Router] Trying ${providerLabel}...`);

      try {
        const response = await provider.generate(payload);
        if (!response?.content?.trim()) {
          throw new Error(`Provider ${provider.name} returned empty content`);
        }

        logs.push({ provider: provider.name, status: 'success' });
        this.logger.info(`[AI Router] Provider = ${providerLabel}`);
        this.logger.info('[AI Router] Status = success');
        this.logger.info(`[AI Router] Provider used = ${providerLabel}`);
        this.logger.info(`[AI Router] Response length = ${response.content.length}`);
        this.logger.info(`[AI Router] router returned provider: ${providerLabel}`);
        return response;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown error';
        const statusCode = typeof (error as { statusCode?: unknown }).statusCode === 'number'
          ? (error as { statusCode: number }).statusCode
          : undefined;
        logs.push({ provider: provider.name, status: 'failed', reason });
        this.logger.error(`[AI Router] Provider = ${providerLabel}`);
        this.logger.error('[AI Router] Status = failed');
        this.logger.error(`[AI Router] HTTP Status = ${statusCode ?? 'n/a'}`);
        this.logger.error(`[AI Router] Message = ${reason}`);
        this.logger.error(error);

        const nextProvider = this.providers[index + 1];
        if (nextProvider) {
          const nextLabel = PROVIDER_DISPLAY_NAMES[nextProvider.name] ?? nextProvider.name;
          this.logger.info(`[AI Router] Switching to ${nextLabel}...`);
        }
      }
    }

    this.logger.error('[AI Router] All providers failed.');

    throw new AiRouterError('Seluruh layanan AI sedang tidak tersedia.', logs);
  }
}
