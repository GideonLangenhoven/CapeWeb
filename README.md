# RDS
RDS

## Deepseek API integration

The CapeWeb Blueprint now calls `/api/deepseek/run` to remix the syllabus automatically. The endpoint lives at `api/deepseek/run.js` and expects the following environment variables:

- `DEEPSEEK_API_KEY` – required to call Deepseek's chat/completions API securely.
- `DEEPSEEK_MODEL` – optional, defaults to `deepseek-chat`.
- `DEEPSEEK_API_URL` – optional override of the API base (`https://api.deepseek.com/v1/chat/completions`).

### Local development

This repository uses Create React App, so the `/api` folder is resolved when the app is served through a platform that executes serverless functions (e.g., `vercel dev`, Vercel production, Netlify functions). If you run `npm start` only, the browser will fall back to the on-device adaptive plan because `/api/deepseek/run` won't exist.

For a full end-to-end loop locally:

1. Install dependencies (including the new `node-fetch`) and set your Deepseek key.
2. Run `vercel dev` (or your hosting provider's equivalent) so the React app and the `/api` function run together.
3. The UI auto-refreshes whenever your Business DNA or quiz results change; tweak one Business DNA field if you need to force a refresh or surface API errors inline.

If no API key is set, the endpoint returns a safe fallback using the locally computed adaptive plan so you can still demo the UX without live AI calls.
