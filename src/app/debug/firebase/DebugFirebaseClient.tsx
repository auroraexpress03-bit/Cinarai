'use client';

import { useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';

type EnvVars = Record<string, string | undefined>;

type TestResult = {
  status: 'idle' | 'success' | 'failed';
  message: string;
  code?: string;
  path?: string;
  payload?: Record<string, unknown> | string;
  uid?: string;
  projectId?: string;
};

interface DebugFirebaseClientProps {
  runtimeEnv: EnvVars;
  localEnv?: EnvVars;
  rulesText?: string | null;
}

const debugPayloadTemplate = (uid: string) => ({
  userId: uid,
  createdAt: 'serverTimestamp()',
  test: true,
});

const progressPayloadTemplate = (uid: string) => ({
  userId: uid,
  createdAt: 'serverTimestamp()',
  test: true,
});

function buildTestResult(
  status: TestResult['status'],
  message: string,
  extra?: Omit<TestResult, 'status' | 'message'>
): TestResult {
  return {
    status,
    message,
    ...extra,
  };
}

export default function DebugFirebaseClient({ runtimeEnv, localEnv, rulesText }: DebugFirebaseClientProps) {
  const { user, loading } = useAuth();
  const [reflectionWriteResult, setReflectionWriteResult] = useState<TestResult>({ status: 'idle', message: 'Belum diuji' });
  const [reflectionReadResult, setReflectionReadResult] = useState<TestResult>({ status: 'idle', message: 'Belum diuji' });
  const [progressWriteResult, setProgressWriteResult] = useState<TestResult>({ status: 'idle', message: 'Belum diuji' });

  const projectId = runtimeEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'unset';
  const authStatus = loading ? 'Loading' : user ? 'Authenticated' : 'Not Authenticated';
  const uid = user?.uid ?? 'unauthenticated';
  const email = user?.email ?? 'unknown';

  const reflectionPath = useMemo(() => 'reflection/debug_test', []);
  const progressPath = useMemo(() => `users/${uid}/progress/debug`, [uid]);
  const reflectionPayload = useMemo(() => debugPayloadTemplate(uid), [uid]);
  const progressPayload = useMemo(() => progressPayloadTemplate(uid), [uid]);

  const handleReflectionWrite = async () => {
    if (!user?.uid) {
      setReflectionWriteResult(buildTestResult('failed', 'User belum login.', { uid: 'unauthenticated', projectId, path: reflectionPath, payload: reflectionPayload }));
      return;
    }

    try {
      await setDoc(doc(firestore, 'reflection', 'debug_test'), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        test: true,
      });
      setReflectionWriteResult(buildTestResult('success', '✅ SUCCESS', {
        path: reflectionPath,
        payload: reflectionPayload,
        uid: user.uid,
        projectId,
      }));
    } catch (error: unknown) {
      const code = typeof (error as { code?: string })?.code === 'string' ? (error as { code?: string }).code : 'unknown';
      setReflectionWriteResult(buildTestResult('failed', '❌ FAILED', {
        code,
        path: reflectionPath,
        payload: reflectionPayload,
        uid: user.uid,
        projectId,
      }));
    }
  };

  const handleReflectionRead = async () => {
    try {
      const snapshot = await getDoc(doc(firestore, 'reflection', 'debug_test'));
      if (snapshot.exists()) {
        setReflectionReadResult(buildTestResult('success', '✅ SUCCESS', {
          path: reflectionPath,
          payload: 'read existing document',
          uid,
          projectId,
        }));
      } else {
        setReflectionReadResult(buildTestResult('failed', '❌ FAILED - Dokumen tidak ditemukan', {
          path: reflectionPath,
          payload: 'read existing document',
          uid,
          projectId,
        }));
      }
    } catch (error: unknown) {
      const code = typeof (error as { code?: string })?.code === 'string' ? (error as { code?: string }).code : 'unknown';
      setReflectionReadResult(buildTestResult('failed', '❌ FAILED', {
        code,
        path: reflectionPath,
        payload: 'read existing document',
        uid,
        projectId,
      }));
    }
  };

  const handleProgressWrite = async () => {
    if (!user?.uid) {
      setProgressWriteResult(buildTestResult('failed', 'User belum login.', { uid: 'unauthenticated', projectId, path: progressPath, payload: progressPayload }));
      return;
    }

    try {
      await setDoc(doc(firestore, 'users', user.uid, 'progress', 'debug'), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        test: true,
      });
      setProgressWriteResult(buildTestResult('success', '✅ SUCCESS', {
        path: progressPath,
        payload: progressPayload,
        uid: user.uid,
        projectId,
      }));
    } catch (error: unknown) {
      const code = typeof (error as { code?: string })?.code === 'string' ? (error as { code?: string }).code : 'unknown';
      setProgressWriteResult(buildTestResult('failed', '❌ FAILED', {
        code,
        path: progressPath,
        payload: progressPayload,
        uid: user.uid,
        projectId,
      }));
    }
  };

  const environmentAudit = useMemo(() => {
    const keys = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ] as const;
    return keys.map((key) => ({
      key,
      runtime: runtimeEnv[key],
      local: localEnv?.[key] ?? 'not available',
      same: runtimeEnv[key] === localEnv?.[key],
    }));
  }, [runtimeEnv, localEnv]);

  const rulesSnippet = useMemo(() => {
    if (!rulesText) return 'Tidak ada rules lokal.';
    const reflectionMatch = rulesText.match(/match \/reflection\/{docId}[\s\S]*?\}/);
    const progressMatch = rulesText.match(/match \/users\/{uid}[\s\S]*?match \/progress\/{comicId}[\s\S]*?\}/);
    return [reflectionMatch?.[0] ?? 'reflection rule tidak ditemukan', progressMatch?.[0] ?? 'progress rule tidak ditemukan'].join('\n\n');
  }, [rulesText]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black">Firebase Runtime Debug</h1>
          <p className="mt-2 text-sm text-slate-600">Halaman ini menampilkan audit runtime Firebase dan membantu memverifikasi write/read Firestore.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Auth Status</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div><strong>Authentication Status:</strong> {authStatus}</div>
              <div><strong>Current User UID:</strong> {user?.uid ?? '—'}</div>
              <div><strong>Email User:</strong> {email}</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Firebase Config</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div><strong>Project ID:</strong> {projectId}</div>
              <div><strong>Auth Domain:</strong> {runtimeEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'unset'}</div>
              <div><strong>Firestore Connection:</strong> initialized</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Environment Audit</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="py-2 pr-4">Variable</th>
                  <th className="py-2 pr-4">Runtime</th>
                  <th className="py-2 pr-4">Local .env.local</th>
                  <th className="py-2">Match</th>
                </tr>
              </thead>
              <tbody>
                {environmentAudit.map((entry) => (
                  <tr key={entry.key} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-semibold">{entry.key}</td>
                    <td className="py-2 pr-4">{entry.runtime ?? 'unset'}</td>
                    <td className="py-2 pr-4">{entry.local ?? 'unset'}</td>
                    <td className="py-2">{entry.same ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Reflection Write</h2>
            <p className="mt-2 text-sm text-slate-600">Path: {reflectionPath}</p>
            <p className="mt-2 text-sm text-slate-600">Payload: <code>{JSON.stringify(reflectionPayload)}</code></p>
            <button
              type="button"
              onClick={handleReflectionWrite}
              className="mt-4 inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Test Firestore Write
            </button>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Status: {reflectionWriteResult.status}</p>
              <p>{reflectionWriteResult.message}</p>
              {reflectionWriteResult.code && <p><strong>error.code:</strong> {reflectionWriteResult.code}</p>}
              {reflectionWriteResult.message && reflectionWriteResult.status === 'failed' && <p><strong>error.message:</strong> {reflectionWriteResult.message}</p>}
              {reflectionWriteResult.path && <p><strong>Path:</strong> {reflectionWriteResult.path}</p>}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Reflection Read</h2>
            <p className="mt-2 text-sm text-slate-600">Path: {reflectionPath}</p>
            <button
              type="button"
              onClick={handleReflectionRead}
              className="mt-4 inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Test Firestore Read
            </button>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Status: {reflectionReadResult.status}</p>
              <p>{reflectionReadResult.message}</p>
              {reflectionReadResult.code && <p><strong>error.code:</strong> {reflectionReadResult.code}</p>}
              {reflectionReadResult.message && reflectionReadResult.status === 'failed' && <p><strong>error.message:</strong> {reflectionReadResult.message}</p>}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Progress Write</h2>
            <p className="mt-2 text-sm text-slate-600">Path: {progressPath}</p>
            <p className="mt-2 text-sm text-slate-600">Payload: <code>{JSON.stringify(progressPayload)}</code></p>
            <button
              type="button"
              onClick={handleProgressWrite}
              className="mt-4 inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Test Progress Write
            </button>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Status: {progressWriteResult.status}</p>
              <p>{progressWriteResult.message}</p>
              {progressWriteResult.code && <p><strong>error.code:</strong> {progressWriteResult.code}</p>}
              {progressWriteResult.message && progressWriteResult.status === 'failed' && <p><strong>error.message:</strong> {progressWriteResult.message}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Firestore Rules Audit</h2>
          <div className="mt-4 text-sm text-slate-700">
            <p>Local `firestore.rules` snippet:</p>
            <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
              {rulesSnippet}
            </pre>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">mergeFirestoreDocument()</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Fungsi menggunakan <strong>setDoc()</strong> dengan opsi <code>{'{ merge: true }'}</code>.</p>
            <p>Itu berarti:</p>
            <ul className="list-disc pl-5">
              <li><strong>setDoc</strong> digunakan untuk create/update.</li>
              <li><strong>updateDoc</strong> tidak digunakan.</li>
              <li><strong>addDoc</strong> tidak digunakan.</li>
            </ul>
            <p>Alasan: agar dokumen dapat dibuat jika belum ada, dan field dapat ditambahkan tanpa menimpa seluruh dokumen.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
