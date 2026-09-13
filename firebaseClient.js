import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy as fbOrderBy,
  limit as fbLimit,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let db = null;
let auth = null;

if (!getApps().length && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.warn('Firebase init failed:', e.message || e);
  }
}

const setDemoUser = (user) => {
  if (typeof window === 'undefined') return null;
  localStorage.setItem('urbanhub_demo_user', JSON.stringify(user));
  return user;
};

const readDemoUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('urbanhub_demo_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const safeCollection = (name) => (db ? collection(db, name) : null);

const parseOrder = (orderStr) => {
  if (!orderStr) return null;
  const desc = orderStr.startsWith('-');
  const field = desc ? orderStr.slice(1) : orderStr;
  return { field, desc };
};

const normalizedCollectionName = (name) => {
  const map = {
    ServiceRequest: 'serviceRequests',
    Request: 'serviceRequests',
    Notification: 'notifications',
    Department: 'departments',
    Announcement: 'announcements',
    Comment: 'comments',
    User: 'users',
    Profile: 'users'
  };

  if (!name) return 'serviceRequests';
  if (map[name]) return map[name];
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
};

const entityAdapter = (name) => ({
  list: (orderStr, limit) => entities.list(normalizedCollectionName(name), orderStr, limit),
  get: (id) => entities.get(normalizedCollectionName(name), id),
  create: (data) => entities.create(normalizedCollectionName(name), data),
  update: (id, data) => entities.update(normalizedCollectionName(name), id, data),
  delete: (id) => entities.delete(normalizedCollectionName(name), id),
  filter: (filters) => entities.filter(normalizedCollectionName(name), filters),
  bulkUpdate: async (updates = []) => Promise.all(
    updates.map(({ id, ...rest }) => entities.update(normalizedCollectionName(name), id, rest))
  )
});

export const entities = {
  async list(collectionName, orderStr, limit) {
    try {
      const col = safeCollection(normalizedCollectionName(collectionName));
      if (!col) return [];
      const ord = parseOrder(orderStr);
      const q = ord
        ? query(col, fbOrderBy(ord.field, ord.desc ? 'desc' : 'asc'), ...(limit ? [fbLimit(limit)] : []))
        : limit
          ? query(col, fbLimit(limit))
          : query(col);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('entities.list error', e);
      return [];
    }
  },
  async get(collectionName, id) {
    try {
      const ref = doc(db, normalizedCollectionName(collectionName), id);
      const snap = await getDoc(ref);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
      console.warn('entities.get error', e);
      return null;
    }
  },
  async create(collectionName, data) {
    try {
      const col = safeCollection(normalizedCollectionName(collectionName));
      if (!col) {
        const seeded = { ...data, id: crypto?.randomUUID ? crypto.randomUUID() : `local-${Date.now()}` };
        return seeded;
      }
      const payload = { ...data, created_date: serverTimestamp() };
      const ref = await addDoc(col, payload);
      return { id: ref.id, ...payload };
    } catch (e) {
      console.warn('entities.create', e);
      return { ...data, id: data?.id || `local-${Date.now()}` };
    }
  },
  async update(collectionName, id, data) {
    try {
      const ref = doc(db, normalizedCollectionName(collectionName), id);
      if (!db) return { id, ...data };
      await updateDoc(ref, data);
      return { id, ...data };
    } catch (e) {
      console.warn('entities.update', e);
      return { id, ...data };
    }
  },
  async delete(collectionName, id) {
    try {
      if (!db) return true;
      await deleteDoc(doc(db, normalizedCollectionName(collectionName), id));
      return true;
    } catch (e) {
      console.warn('entities.delete', e);
      return false;
    }
  },
  async filter(collectionName, filters = []) {
    try {
      const col = safeCollection(normalizedCollectionName(collectionName));
      if (!col) return [];
      let q = null;
      if (!filters || (Array.isArray(filters) && filters.length === 0)) {
        q = query(col);
      } else if (!Array.isArray(filters) && typeof filters === 'object') {
        const constraints = Object.keys(filters).map((k) => where(k, '==', filters[k]));
        q = query(col, ...constraints);
      } else {
        q = query(col, ...filters);
      }
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('entities.filter', e);
      return [];
    }
  }
};

export const authClient = {
  me: () => new Promise((resolve) => {
    if (!auth) {
      const user = readDemoUser();
      return resolve(user || null);
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      if (!u) return resolve(null);
      resolve({ uid: u.uid, email: u.email, displayName: u.displayName });
    });
  }),
  loginViaEmailPassword: async (email, password) => {
    if (!auth) {
      const user = setDemoUser({ uid: `local-${Date.now()}`, email, displayName: 'Demo User' });
      return user;
    }
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  },
  register: async (input, passwordArg, profileArg = {}) => {
    const payload = typeof input === 'object' && input !== null && !Array.isArray(input) && ('email' in input || 'password' in input)
      ? input
      : { email: input, password: passwordArg || '', ...profileArg };

    const { email, password, ...profile } = payload;

    if (!auth) {
      const user = {
        uid: `local-${Date.now()}`,
        email,
        displayName: profile.displayName || profile.full_name || email.split('@')[0]
      };
      setDemoUser(user);
      return user;
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (profile.displayName || profile.full_name) {
      await updateProfile(res.user, { displayName: profile.displayName || profile.full_name });
    }
    return res.user;
  },
  loginWithProvider: async (providerName = 'google', returnTo) => {
    if (!auth) {
      const user = setDemoUser({ uid: `local-${Date.now()}`, email: 'demo@urbanhub.local', displayName: 'Google Demo User' });
      if (typeof window !== 'undefined' && returnTo) {
        window.location.href = returnTo;
      }
      return user;
    }
    if (providerName === 'google') {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      return res.user;
    }
    throw new Error('Provider not configured');
  },
  redirectToLogin: (returnTo) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/login?returnTo=${encodeURIComponent(returnTo || window.location.href)}`;
    }
  },
  setToken: (t) => {
    if (typeof window !== 'undefined') localStorage.setItem('token', t || 'local-demo-token');
  },
  updateMe: async (profile) => {
    if (!auth || !auth.currentUser) {
      const user = readDemoUser() || { uid: 'local-demo-user', email: 'demo@urbanhub.local', displayName: 'Demo User' };
      const nextUser = { ...user, displayName: profile.full_name || profile.displayName || user.displayName };
      setDemoUser(nextUser);
      return nextUser;
    }
    await updateProfile(auth.currentUser, { displayName: profile.full_name || profile.displayName || '' });
    return { uid: auth.currentUser.uid, email: auth.currentUser.email, displayName: auth.currentUser.displayName };
  },
  verifyOtp: async ({ email, otpCode } = {}) => {
    if (!auth) {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to verify the code.');
      }

      const user = {
        uid: data.user?.uid || `local-${Date.now()}`,
        email: data.user?.email || email || 'demo@urbanhub.local',
        displayName: data.user?.displayName || 'Demo User'
      };
      setDemoUser(user);
      return { access_token: data.access_token || 'local-demo-token', user };
    }
    return { access_token: null };
  },
  resendOtp: async (email) => {
    const response = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to resend verification code.');
    }

    return data;
  },
  resetPasswordRequest: async (email) => {
    if (!auth) return null;
    return sendPasswordResetEmail(auth, email);
  },
  resetPassword: async (input, passwordArg) => {
    const payload = typeof input === 'object' && input !== null && 'resetToken' in input
      ? input
      : { resetToken: input, newPassword: passwordArg };

    if (!auth) return { ok: true, ...payload };
    return confirmPasswordReset(auth, payload.resetToken, payload.newPassword);
  },
  logout: async (returnTo) => {
    if (!auth) {
      localStorage.removeItem('urbanhub_demo_user');
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && returnTo) window.location.href = returnTo;
      return;
    }
    await signOut(auth);
  }
};

export const base44 = {
  entities: {
    ServiceRequest: entityAdapter('ServiceRequest'),
    Notification: entityAdapter('Notification'),
    Department: entityAdapter('Department'),
    Announcement: entityAdapter('Announcement'),
    Comment: entityAdapter('Comment'),
    User: entityAdapter('User'),
    Request: entityAdapter('Request')
  },
  auth: authClient,
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        if (!file) return { file_url: '' };
        if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          return { file_url: URL.createObjectURL(file) };
        }
        return { file_url: `https://placehold.co/600x400?text=${encodeURIComponent(file.name || 'Upload')}` };
      }
    }
  },
  functions: {
    invoke: async (name, payload = {}) => {
      const description = String(payload?.description || '').trim();
      if (name === 'AICategorize') {
        const text = description.toLowerCase();
        let category = 'Other Municipal Services';
        let priority = 'Medium';

        if (text.includes('water') || text.includes('leak') || text.includes('sewer') || text.includes('sanitation')) {
          category = 'Water & Sanitation';
        } else if (text.includes('power') || text.includes('electric') || text.includes('light')) {
          category = 'Electricity';
        } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic')) {
          category = 'Roads & Infrastructure';
        } else if (text.includes('waste') || text.includes('garbage') || text.includes('dump')) {
          category = 'Waste Management';
        } else if (text.includes('crime') || text.includes('safety') || text.includes('hazard')) {
          category = 'Public Safety & Emergency';
        } else if (text.includes('health') || text.includes('clinic')) {
          category = 'Health Services';
        }

        if (text.includes('urgent') || text.includes('emergency') || text.includes('danger') || text.includes('fire') || text.includes('flood')) {
          priority = 'Emergency';
        } else if (text.includes('outage') || text.includes('leak') || text.includes('broken')) {
          priority = 'High';
        }

        return {
          data: {
            category,
            priority,
            confidence: 0.88,
            error: null
          }
        };
      }

      return { data: { ok: true, ...payload } };
    }
  }
};

export default base44;
