# UrbanHub - Local Development

This repo runs a React frontend that now uses Firebase (Firestore + Auth) as its backend API.

Prerequisites

1. Clone the repository and open the project directory.
2. Create a `.env.local` in the project root with your Firebase config values (replace with your project's values):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Notes

- The app now maps the previous `base44.entities.*` calls to Firestore collections. Example: `ServiceRequest` -> `serviceRequests` collection.
- Authentication uses Firebase Auth where available. Provide Firebase config in `.env.local` so auth features work.
- If you want I can further tailor the Firestore collection names, security rules, or add seed scripts.

Need help configuring Firebase or running the app? Tell me and I'll assist with the next steps.
