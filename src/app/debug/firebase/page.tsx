import fs from 'fs';
import path from 'path';
import DebugFirebaseClient from './DebugFirebaseClient';

const loadEnv = () => {
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const file = fs.readFileSync(envPath, 'utf-8');
    return Object.fromEntries(
      file
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => line.split('=', 2))
        .map(([key, ...rest]) => [key, rest.join('=')])
    );
  } catch {
    return {};
  }
};

const loadRules = () => {
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  try {
    return fs.readFileSync(rulesPath, 'utf-8');
  } catch {
    return null;
  }
};

export default function DebugFirebasePage() {
  const runtimeEnv = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const localEnv = loadEnv();
  const rulesText = loadRules();

  return <DebugFirebaseClient runtimeEnv={runtimeEnv} localEnv={localEnv} rulesText={rulesText} />;
}
