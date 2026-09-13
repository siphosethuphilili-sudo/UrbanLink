# AGENTS.md

## Project Context

This is an UrbanHub app repository. Treat it as user-owned application code and keep changes focused on the user's request.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: (no project-specific CLI required)

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend client shim (wired to Firebase).
- `vite.config.js`: Vite config (Base44 plugin removed).
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- The project now uses Firebase for backend services (Firestore + Auth). Configure `.env.local` with your Firebase values.
- Use `npm run dev` to start the frontend. For full backend seeding, run the seed script after configuring service account credentials:

```bash
npm run seed
```

- Run linting and type checks with `npm run lint` and `npm run typecheck`.
