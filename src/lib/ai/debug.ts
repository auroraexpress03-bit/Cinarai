type ProviderStatus = {
  ready: boolean;
  reason: string;
};

const PROVIDER_ENV_KEYS: Record<string, string> = {
  gemini: 'GEMINI_API_KEY',
  openai: 'OPENAI_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

function getProviderStatus(provider: string): ProviderStatus {
  const envKey = PROVIDER_ENV_KEYS[provider];
  const value = process.env[envKey]?.trim();

  if (!value) {
    return {
      ready: false,
      reason: `Missing ${envKey} in this runtime.`,
    };
  }

  return {
    ready: true,
    reason: `${envKey} is present in this runtime.`,
  };
}

export function getAiProviderRuntimeStatus() {
  return {
    gemini: getProviderStatus('gemini'),
    openai: getProviderStatus('openai'),
    groq: getProviderStatus('groq'),
    openrouter: getProviderStatus('openrouter'),
  };
}

export function logAiProviderStartupStatus(): void {
  const status = getAiProviderRuntimeStatus();

  console.info('[AI Providers]');
  console.info(`Gemini: ${status.gemini.ready ? 'READY' : 'NOT READY'}${status.gemini.ready ? '' : ` (${status.gemini.reason})`}`);
  console.info(`OpenAI: ${status.openai.ready ? 'READY' : 'NOT READY'}${status.openai.ready ? '' : ` (${status.openai.reason})`}`);
  console.info(`Groq: ${status.groq.ready ? 'READY' : 'NOT READY'}${status.groq.ready ? '' : ` (${status.groq.reason})`}`);
  console.info(`OpenRouter: ${status.openrouter.ready ? 'READY' : 'NOT READY'}${status.openrouter.ready ? '' : ` (${status.openrouter.reason})`}`);
}
