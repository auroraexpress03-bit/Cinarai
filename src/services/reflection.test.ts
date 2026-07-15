import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'example.firebaseapp.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '1234567890';
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:test-project:web:test';

import { buildReflectionDocumentPayload } from './reflection.ts';

test('buildReflectionDocumentPayload includes the aliases expected by the app and rules', () => {
  const payload = buildReflectionDocumentPayload({
    userId: 'user-123',
    comicId: 2,
    checklist: ['Saya paham'],
    confidence: 4,
    reflectionText: 'Saya belajar banyak hari ini.',
    stage: 'introspection',
  });

  assert.equal(payload.userId, 'user-123');
  assert.equal(payload.studentId, 'user-123');
  assert.equal(payload.moduleId, '2');
  assert.equal(payload.comicId, '2');
  assert.equal(payload.reflectionText, 'Saya belajar banyak hari ini.');
  assert.deepEqual(payload.checklist, ['Saya paham']);
  assert.equal(payload.stage, 'introspection');
});
