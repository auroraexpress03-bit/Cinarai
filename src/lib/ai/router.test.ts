import test from 'node:test';
import assert from 'node:assert/strict';
import { AiRouter, AiRouterError } from './router';
import type { AiProvider, AiRequestPayload, AiResponse } from './provider';

class StubProvider implements AiProvider {
  public readonly name: 'gemini' | 'groq' | 'openrouter' | 'openai';
  private readonly behavior: 'success' | 'quota' | 'timeout' | 'network' | 'rate-limit' | 'generic';
  private readonly content: string;

  constructor(
    name: 'gemini' | 'groq' | 'openrouter' | 'openai',
    behavior: 'success' | 'quota' | 'timeout' | 'network' | 'rate-limit' | 'generic',
    content = 'ok',
  ) {
    this.name = name;
    this.behavior = behavior;
    this.content = content;
  }

  async generate(_payload: AiRequestPayload): Promise<AiResponse> {
    if (this.behavior === 'success') {
      return { provider: this.name, content: this.content };
    }

    throw new Error(this.behavior);
  }
}

test('falls back to the next provider when the first one hits a retryable error', async () => {
  const router = new AiRouter([
    new StubProvider('gemini', 'quota'),
    new StubProvider('groq', 'success', 'fallback ok'),
  ]);

  const response = await router.generate({ prompt: 'Halo' });

  assert.equal(response.provider, 'groq');
  assert.equal(response.content, 'fallback ok');
});

test('skips providers that do not have an API key configured', () => {
  const previousEnv = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };

  process.env.GEMINI_API_KEY = 'gemini-key';
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const router = AiRouter.createDefault();
    const providers = (router as unknown as { providers: AiProvider[] }).providers;

    assert.deepEqual(providers.map((provider) => provider.name), ['gemini']);
  } finally {
    Object.entries(previousEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
});

test('createDefault uses the requested provider priority order', () => {
  const previousEnv = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };

  process.env.GEMINI_API_KEY = 'gemini-key';
  process.env.OPENAI_API_KEY = 'openai-key';
  process.env.GROQ_API_KEY = 'groq-key';
  process.env.OPENROUTER_API_KEY = 'openrouter-key';

  try {
    const router = AiRouter.createDefault();
    const providers = (router as unknown as { providers: AiProvider[] }).providers;

    assert.deepEqual(providers.map((provider) => provider.name), ['gemini', 'openai', 'groq', 'openrouter']);
  } finally {
    Object.entries(previousEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
});

test('returns a friendly error when every provider fails', async () => {
  const router = new AiRouter([
    new StubProvider('gemini', 'timeout'),
    new StubProvider('groq', 'network'),
    new StubProvider('openrouter', 'rate-limit'),
    new StubProvider('openai', 'generic'),
  ]);

  await assert.rejects(
    () => router.generate({ prompt: 'Halo' }),
    (error: unknown) => {
      assert.ok(error instanceof AiRouterError);
      assert.match(error.message, /semua provider ai gagal/i);
      assert.equal(error.logs.length, 4);
      return true;
    },
  );
});
