const admin = require('firebase-admin');
console.log(Object.keys(admin));
console.log('credential' in admin, typeof admin.credential);
console.dir(admin.credential, { depth: 2 });
