const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let projectId = process.env.FIREBASE_PROJECT_ID;
let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (!m) return;
      const k = m[1].trim();
      let v = m[2];
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (k === 'FIREBASE_PROJECT_ID') projectId = projectId || v;
      if (k === 'FIREBASE_CLIENT_EMAIL') clientEmail = clientEmail || v;
      if (k === 'FIREBASE_PRIVATE_KEY') privateKey = privateKey || v.replace(/\\n/g, '\n');
    });
  }
}

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing service account env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const db = admin.firestore();

async function listUsers() {
  const snapshot = await db.collection('users').get();
  console.log('Found', snapshot.size, 'user documents');
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(JSON.stringify({ documentId: doc.id, uid: data.uid, role: data.role, email: data.email }));
  });
}

listUsers().catch(err => { console.error(err); process.exit(2); });
