/*
Simple Firestore seeding script using firebase-admin.
Usage:
  - Place a service account JSON at ./service-account.json OR set env var GOOGLE_APPLICATION_CREDENTIALS.
  - Run: node ./scripts/seed-firebase.js
*/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const svcPath = path.resolve(process.cwd(), 'service-account.json');
if (fs.existsSync(svcPath)) {
  admin.initializeApp({ credential: admin.credential.cert(svcPath) });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp();
} else {
  console.error('No service account found. Set GOOGLE_APPLICATION_CREDENTIALS or place service-account.json in project root.');
  process.exit(1);
}

const db = admin.firestore();

async function seed() {
  console.log('Seeding Firestore...');

  // Seed departments
  const departments = [
    { name: 'Water', slug: 'water' },
    { name: 'Electricity', slug: 'electricity' },
    { name: 'Waste', slug: 'waste' },
    { name: 'Roads', slug: 'roads' },
    { name: 'Safety', slug: 'safety' },
  ];

  for (const d of departments) {
    const ref = db.collection('departments').doc(d.slug);
    await ref.set({ ...d, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Wrote department', d.slug);
  }

  // Seed announcements
  const announcements = [
    { title: 'Roadworks on Main Street', body: 'Expect delays on Main St this week.', category: 'Roads' },
    { title: 'Water interruption', body: 'Planned maintenance Wednesday.', category: 'Water' },
  ];

  for (const a of announcements) {
    await db.collection('announcements').add({ ...a, created_date: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Wrote announcement', a.title);
  }

  // Seed a couple of service requests
  const requests = [
    { title: 'Pothole on 5th Ave', category: 'Roads', status: 'Submitted', reference_number: 'REQ-001', days_open: 2 },
    { title: 'Water leak near Park', category: 'Water', status: 'In Progress', reference_number: 'REQ-002', days_open: 5 },
  ];

  for (const r of requests) {
    await db.collection('serviceRequests').add({ ...r, created_date: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Wrote request', r.title);
  }

  // Seed notifications
  const notifs = [
    { title: 'New comment on REQ-001', body: 'A contractor has been assigned.', read: false },
    { title: 'Water maintenance reminder', body: 'Servicewindow starts at 10:00.', read: false },
  ];
  for (const n of notifs) {
    await db.collection('notifications').add({ ...n, created_date: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Wrote notification', n.title);
  }

  // Seed comments linked to requests
  const comments = [
    { request_id: 'REQ-001', body: 'We will inspect tomorrow.', author: 'admin' },
    { request_id: 'REQ-002', body: 'Work in progress.', author: 'worker' },
  ];
  for (const c of comments) {
    await db.collection('comments').add({ ...c, created_date: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Wrote comment for', c.request_id);
  }

  // Create a demo user (if not existing)
  try {
    const existing = await admin.auth().getUserByEmail('demo@urbanhub.local').catch(() => null);
    if (!existing) {
      const user = await admin.auth().createUser({ email: 'demo@urbanhub.local', password: 'Password123', displayName: 'Demo User' });
      console.log('Created demo user', user.uid);
    } else {
      console.log('Demo user already exists');
    }
  } catch (e) {
    console.warn('Failed to create demo user:', e.message || e);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
