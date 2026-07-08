import { NextResponse } from 'next/server';
import { getAiProviderRuntimeStatus } from '@/lib/ai/debug';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in non-development environments.' }, { status: 404 });
  }

  const status = getAiProviderRuntimeStatus();

  return NextResponse.json({
    gemini: status.gemini.ready,
    openai: status.openai.ready,
    groq: status.groq.ready,
    openrouter: status.openrouter.ready,
  });
}
