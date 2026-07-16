import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminFirestore, verifyIdToken } from '@/lib/firebase/admin';
import type { ActivityDocument, ComicDocument, ComicProgressDocument, ReflectionDocument, UserDocument } from '@/types/firestore';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

function serializeUser(document: DocumentSnapshot): UserDocument {
  const data = document.data() as Partial<UserDocument> | undefined;
  return {
    id: document.id,
    uid: data?.uid ?? document.id,
    email: data?.email ?? '',
    displayName: data?.displayName,
    photoURL: data?.photoURL,
    role: (data?.role as UserDocument['role']) ?? 'student',
    schoolName: data?.schoolName,
    gradeLevel: data?.gradeLevel,
    isActive: data?.isActive ?? true,
    lastLoginAt: data?.lastLoginAt as UserDocument['lastLoginAt'],
    createdAt: data?.createdAt as UserDocument['createdAt'],
    updatedAt: data?.updatedAt as UserDocument['updatedAt'],
  };
}

function serializeProgress(document: DocumentSnapshot): ComicProgressDocument {
  const data = document.data() as Partial<ComicProgressDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId ?? document.ref.parent.parent?.id ?? '',
    comicId: data?.comicId ?? Number(document.id.replace('comic-', '')),
    completedStage: data?.completedStage ?? '',
    completedPages: data?.completedPages ?? 0,
    percentage: data?.percentage ?? 0,
    status: data?.status ?? 'not_started',
    sintaksList: data?.sintaksList ?? [],
    introspection: data?.introspection,
    completedAt: data?.completedAt as ComicProgressDocument['completedAt'],
    updatedAt: data?.updatedAt as ComicProgressDocument['updatedAt'],
    createdAt: data?.createdAt as ComicProgressDocument['createdAt'],
  };
}

function serializeActivity(document: DocumentSnapshot): ActivityDocument {
  const data = document.data() as Partial<ActivityDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId ?? '',
    type: data?.type ?? 'login',
    title: data?.title ?? '',
    description: data?.description,
    metadata: data?.metadata,
    occurredAt: data?.occurredAt as ActivityDocument['occurredAt'],
  };
}

function serializeReflection(document: DocumentSnapshot): ReflectionDocument {
  const data = document.data() as Partial<ReflectionDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId,
    studentId: data?.studentId,
    moduleId: data?.moduleId,
    comicId: data?.comicId,
    prompt: data?.prompt,
    response: data?.response,
    selectedChecklist: data?.selectedChecklist,
    checklist: data?.checklist,
    rating: data?.rating,
    confidence: data?.confidence,
    reflectionText: data?.reflectionText,
    aiReflection: data?.aiReflection,
    jawaban: data?.jawaban,
    timestamp: data?.timestamp as ReflectionDocument['timestamp'],
    stage: data?.stage,
    status: data?.status,
    submittedAt: data?.submittedAt as ReflectionDocument['submittedAt'],
    createdAt: data?.createdAt as ReflectionDocument['createdAt'],
    updatedAt: data?.updatedAt as ReflectionDocument['updatedAt'],
  };
}

function serializeComic(document: DocumentSnapshot): ComicDocument {
  const data = document.data() as Partial<ComicDocument> | undefined;
  return {
    id: document.id,
    comicId: data?.comicId ?? Number(document.id),
    slug: data?.slug ?? document.id,
    title: data?.title ?? document.id,
    subtitle: data?.subtitle ?? '',
    kelas: data?.kelas ?? '',
    lokasi: data?.lokasi ?? '',
    synopsis: data?.synopsis ?? '',
    characters: data?.characters ?? [],
    learningTargets: data?.learningTargets ?? [],
    estimatedMinutes: data?.estimatedMinutes ?? 0,
    pdfUrl: data?.pdfUrl ?? null,
    coverUrl: data?.coverUrl ?? '',
    thumbnailUrl: data?.thumbnailUrl ?? '',
    order: data?.order ?? 0,
    availability: data?.availability ?? 'ACTIVE',
    createdAt: data?.createdAt as ComicDocument['createdAt'],
    updatedAt: data?.updatedAt as ComicDocument['updatedAt'],
  };
}

export async function GET(request: NextRequest) {
  try {
    // ========== STEP 1: Check Admin SDK initialization ==========
    console.log('[GuruDashboard API] === START REQUEST ===');
    console.log('[GuruDashboard API] Admin SDK initialized:', { adminAuth: !!adminAuth, adminFirestore: !!adminFirestore });
    console.log('[GuruDashboard API] Environment check:', {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓' : '✗ MISSING',
      sdkKey: process.env.FIREBASE_ADMIN_SDK_KEY ? '✓' : '✗ MISSING',
    });

    if (!adminAuth) {
      const msg = 'Admin Auth not initialized. Check FIREBASE_ADMIN_SDK_KEY in environment.';
      console.error('[GuruDashboard API] ERROR:', msg);
      return NextResponse.json(
        { success: false, message: msg, error: 'Admin Auth unavailable' },
        { status: 500 }
      );
    }

    if (!adminFirestore) {
      const msg = 'Admin Firestore not initialized. Check FIREBASE_ADMIN_SDK_KEY in environment.';
      console.error('[GuruDashboard API] ERROR:', msg);
      return NextResponse.json(
        { success: false, message: msg, error: 'Admin Firestore unavailable' },
        { status: 500 }
      );
    }

    // ========== STEP 2: Verify token ==========
    const headerValue = request.headers.get('authorization');
    const token = headerValue?.startsWith('Bearer ') ? headerValue.slice(7) : null;

    if (!token) {
      console.warn('[GuruDashboard API] Unauthorized: token not provided');
      return NextResponse.json({ success: false, message: 'Unauthorized: token not provided' }, { status: 401 });
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid) {
      console.warn('[GuruDashboard API] Unauthorized: invalid token');
      return NextResponse.json({ success: false, message: 'Unauthorized: invalid token' }, { status: 401 });
    }

    // ========== STEP 3: Get user profile and role ==========
    const uid = decodedToken.uid;
    const email = decodedToken.email || 'unknown';
    console.log('[GuruDashboard API] GET /api/dashboard/guru', { uid, email });

    let role: string | undefined;
    let profileEmail: string | undefined;
    try {
      const profileSnapshot = await adminFirestore.collection('users').doc(uid).get();
      console.log('[GuruDashboard API] Querying collection: users, doc: ' + uid);
      console.log('[GuruDashboard API] User profile exists:', profileSnapshot.exists);

      if (profileSnapshot.exists) {
        const userData = profileSnapshot.data();
        role = userData?.role as string | undefined;
        profileEmail = userData?.email as string | undefined;
        console.log('[GuruDashboard API] User role:', role, '- email:', profileEmail);
      } else {
        console.warn('[GuruDashboard API] User profile not found in Firestore for uid:', uid);
      }
    } catch (error) {
      console.error('[GuruDashboard API] Error querying users collection:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch user profile',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    if (role !== 'teacher' && role !== 'admin') {
      console.warn('[GuruDashboard API] Forbidden: user role is not teacher or admin', { uid, role });
      return NextResponse.json(
        { success: false, message: 'Akun ini bukan akun guru.' },
        { status: 403 }
      );
    }

    // ========== STEP 4: Query all collections with Promise.allSettled ==========
    console.log('[GuruDashboard API] === QUERYING COLLECTIONS ===');
    const results = await Promise.allSettled([
      (async () => {
        try {
          console.log('[GuruDashboard API] Querying collection: users (where role == student)');
          const snap = await adminFirestore.collection('users').where('role', '==', 'student').get();
          console.log('[GuruDashboard API] ✓ students collection:', snap.docs.length, 'documents');
          return snap;
        } catch (error) {
          console.error('[GuruDashboard API] ✗ Error querying students:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return null;
        }
      })(),
      (async () => {
        try {
          console.log('[GuruDashboard API] Querying collection: comics');
          const snap = await adminFirestore.collection('comics').get();
          console.log('[GuruDashboard API] ✓ comics collection:', snap.docs.length, 'documents');
          return snap;
        } catch (error) {
          console.error('[GuruDashboard API] ✗ Error querying comics:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return null;
        }
      })(),
      (async () => {
        try {
          console.log('[GuruDashboard API] Querying collectionGroup: progress');
          const snap = await adminFirestore.collectionGroup('progress').get();
          console.log('[GuruDashboard API] ✓ progress collectionGroup:', snap.docs.length, 'documents');
          return snap;
        } catch (error) {
          console.error('[GuruDashboard API] ✗ Error querying progress:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return null;
        }
      })(),
      (async () => {
        try {
          console.log('[GuruDashboard API] Querying collection: activity (DESC by occurredAt, limit 20)');
          const snap = await adminFirestore.collection('activity').orderBy('occurredAt', 'desc').limit(20).get();
          console.log('[GuruDashboard API] ✓ activity collection:', snap.docs.length, 'documents');
          return snap;
        } catch (error) {
          console.error('[GuruDashboard API] ✗ Error querying activity:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return null;
        }
      })(),
      (async () => {
        try {
          console.log('[GuruDashboard API] Querying collection: reflection (DESC by createdAt, limit 200)');
          const snap = await adminFirestore.collection('reflection').orderBy('createdAt', 'desc').limit(200).get();
          console.log('[GuruDashboard API] ✓ reflection collection:', snap.docs.length, 'documents');
          return snap;
        } catch (error) {
          console.error('[GuruDashboard API] ✗ Error querying reflection:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return null;
        }
      })(),
    ]);

    // ========== STEP 5: Process results ==========
    const studentsSnapshot = results[0]?.status === 'fulfilled' ? results[0].value : null;
    const comicsSnapshot = results[1]?.status === 'fulfilled' ? results[1].value : null;
    const progressSnapshot = results[2]?.status === 'fulfilled' ? results[2].value : null;
    const activitySnapshot = results[3]?.status === 'fulfilled' ? results[3].value : null;
    const reflectionsSnapshot = results[4]?.status === 'fulfilled' ? results[4].value : null;

    const students = studentsSnapshot ? studentsSnapshot.docs.map(serializeUser) : [];
    const comics = comicsSnapshot ? comicsSnapshot.docs.map(serializeComic) : [];
    const progressDocuments = progressSnapshot ? progressSnapshot.docs.map(serializeProgress) : [];
    const activities = activitySnapshot ? activitySnapshot.docs.map(serializeActivity) : [];
    const reflections = reflectionsSnapshot ? reflectionsSnapshot.docs.map(serializeReflection) : [];

    console.log('[GuruDashboard API] === RESPONSE SUMMARY ===', {
      studentsCount: students.length,
      comicsCount: comics.length,
      progressCount: progressDocuments.length,
      activitiesCount: activities.length,
      reflectionsCount: reflections.length,
    });

    return NextResponse.json({
      success: true,
      students,
      comics,
      progressDocuments,
      activities,
      reflections,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[GuruDashboard API] === UNEXPECTED ERROR ===', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Dashboard guru gagal dimuat',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
