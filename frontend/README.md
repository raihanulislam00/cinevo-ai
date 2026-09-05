# Cinevo AI frontend

Cinevo is an AI video maker interface built with Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, Axios, React Hook Form, Zod, Socket.IO Client, and Sonner.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The NestJS API is expected at http://localhost:9000.

## Environment variables

Local values live in `.env.local`. Add the following variables to Vercel Project Settings for Production, Preview, and Development deployments:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.example.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.example.com
```

Only public URLs belong in the frontend. Never add `GEMINI_API_KEY`, `DATABASE_URL`, JWT secrets, Redis credentials, or provider keys here.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Keep the framework preset as Next.js.
4. Add `NEXT_PUBLIC_API_URL` with the deployed backend URL including `/api`.
5. Add `NEXT_PUBLIC_SOCKET_URL` with the deployed backend origin, without `/api`.
6. Redeploy after changing environment variables.

The backend must allow the Vercel origin in `CORS_ORIGIN`, for example:

```env
CORS_ORIGIN=https://cinevo.vercel.app,http://localhost:3000
```

The backend also needs hosted PostgreSQL, Redis, Gemini, JWT secrets, and durable object storage. Local filesystem storage is not suitable for production. Socket.IO requires a backend host that supports long-lived WebSocket connections; do not deploy the WebSocket server as a short-lived serverless function.

## API integration

The frontend uses the NestJS routes for auth, dashboard, AI chat, conversations, videos, video status, and cancellation. Access and refresh tokens are managed by the Axios client; Gemini is never called from the browser.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/login` | Sign in |
| `/register` | Create an account |
| `/dashboard` | Workspace overview |
| `/create` | AI chat and video plan editor |
| `/videos` | Video library |
| `/videos/:id` | Video detail and generation progress |
| `/settings` | Profile and appearance settings |

## Quality checks

```bash
npm run lint
npm run build
```
