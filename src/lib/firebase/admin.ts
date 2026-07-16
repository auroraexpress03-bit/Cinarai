import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { validateEnv } from '@/lib/env.server';

validateEnv();

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminFirestore: Firestore | undefined;
let adminStorage: Storage | undefined;

const initializeAdmin = (): void => {
  if (adminApp) return;

  try {
    console.log('[Firebase Admin] Attempting to initialize Admin SDK...');

    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || undefined;

    // ========== AUDIT: Check all required environment variables ==========
    const envStatus = {
      FIREBASE_ADMIN_SDK_KEY: serviceAccountKey ? '✓ SET' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId ? '✓ SET' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket ? '✓ SET' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_DATABASE_URL: databaseURL ? '✓ SET' : '○ OPTIONAL',
    };
    console.log('[Firebase Admin] Environment Variables:', envStatus);

    if (!serviceAccountKey) {
      console.error('[Firebase Admin] CRITICAL: FIREBASE_ADMIN_SDK_KEY is not set. Admin SDK initialization will fail.');
      console.error('[Firebase Admin] Please set FIREBASE_ADMIN_SDK_KEY in .env.local or environment.');
      console.error('[Firebase Admin] Value must be a valid Firebase service account JSON as a single-line string.');
      return;
    }

    if (!projectId) {
      console.error('[Firebase Admin] CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.');
      return;
    }

    // ========== Parse service account ==========
    let serviceAccount: any;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
      console.log('[Firebase Admin] Service account parsed successfully:', {
        type: serviceAccount.type,
        project_id: serviceAccount.project_id,
        client_email: serviceAccount.client_email,
      });
    } catch (parseError) {
      console.error('[Firebase Admin] CRITICAL: Failed to parse FIREBASE_ADMIN_SDK_KEY as JSON:', {
        error: parseError instanceof Error ? parseError.message : String(parseError),
      });
      return;
    }

    // ========== Initialize Admin SDK ==========
    console.log('[Firebase Admin] Initializing Firebase Admin App...');
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId,
      storageBucket,
      databaseURL,
    });

    adminAuth = getAuth(adminApp);
    adminFirestore = getFirestore(adminApp);
    adminStorage = getStorage(adminApp);

    console.log('[Firebase Admin] ✓ Admin SDK initialized successfully:', {
      projectId,
      storageBucket,
      databaseURL: databaseURL ? '✓' : '○',
    });
  } catch (error) {
    console.error('[Firebase Admin] CRITICAL: Failed to initialize Admin SDK:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};

initializeAdmin();

export { adminApp, adminAuth, adminFirestore, adminStorage };

export const verifyIdToken = async (token: string): Promise<DecodedIdToken | null> => {
  try {
    if (!adminAuth) {
      console.error('[Firebase Admin] verifyIdToken: Admin Auth not initialized. Cannot verify token.');
      return null;
    }
    const decoded = await adminAuth.verifyIdToken(token);
    console.log('[Firebase Admin] verifyIdToken: Token verified successfully for uid:', decoded.uid);
    return decoded;
  } catch (error) {
    console.error('[Firebase Admin] verifyIdToken: Error verifying ID token:', {
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code || 'UNKNOWN',
    });
    return null;
  }
};
