# Cinevo AI

Cinevo AI is a full-stack AI video maker SaaS. Users can describe a video idea, collaborate with an AI assistant, edit a structured video plan, queue video generation, and track progress from a personal video library.

The repository contains two applications:

- `frontend`: Next.js App Router application with the Cinevo creative workspace.
- `backend`: NestJS REST and WebSocket API with Prisma, PostgreSQL, Redis, BullMQ, Gemini, and storage adapters.

## Product Features

- Public marketing page with responsive design.
- Email/password registration and login.
- JWT access and refresh token authentication.
- Dashboard statistics and recent videos.
- AI chat for developing video concepts.
- Editable video plans with scenes, narration, visual prompts, audience, platform, duration, and style.
- Asynchronous video generation jobs.
- Real-time Socket.IO generation events with HTTP polling fallback.
- Video library with search and status filtering.
- Video detail pages with progress, scenes, and generated output playback.
- Appearance settings with light, dark, and system themes.
- Accessible responsive layout with mobile navigation.

## Architecture

```text
Browser
	|
	| HTTPS REST + Socket.IO
	v
Next.js frontend (Vercel or another web host)
	|
	v
NestJS backend (long-running Node.js service)
	|              \
	|               +--> Gemini API
	|               +--> S3-compatible or local storage
	v
PostgreSQL <--> Redis/BullMQ video worker
```

The browser never calls Gemini directly. Gemini keys, database credentials, JWT secrets, Redis credentials, and storage credentials belong only in the backend environment.

## Requirements

- Node.js 22 or newer.
- npm 10 or newer.
- Docker Desktop, if using the containerized PostgreSQL and Redis services.
- A PostgreSQL database and Redis instance.
- A Gemini API key for AI chat.

## Repository Layout

```text
.
├── backend/
│   ├── prisma/                 # Prisma schema, migrations, and seed
│   ├── src/                    # NestJS modules and API implementation
│   ├── docker-compose.yml      # Backend, PostgreSQL, and Redis services
│   ├── Dockerfile              # Production backend image
│   └── .env.example            # Backend environment template
├── frontend/
│   ├── app/                    # Next.js routes
│   ├── components/             # UI, layout, auth, AI, and video components
│   ├── hooks/                  # TanStack Query and realtime hooks
│   ├── services/               # Axios API and domain services
│   ├── types/                  # Shared frontend API types
│   └── .env.example            # Public frontend environment template
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
npx prisma generate

cd ../frontend
npm install
```

### 2. Start PostgreSQL and Redis

From the backend directory:

```bash
cd backend
docker compose up -d postgres redis
docker compose ps
```

The default local services are:

| Service | URL/port | Default credentials |
| --- | --- | --- |
| PostgreSQL | `localhost:5432` | database `cinevo`, user `cinevo`, password `cinevo` |
| Redis | `localhost:6379` | no password |

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`. At minimum, set:

```env
DATABASE_URL=postgresql://cinevo:cinevo@localhost:5432/cinevo
JWT_ACCESS_SECRET=use-a-long-random-secret
JWT_REFRESH_SECRET=use-another-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGIN=http://localhost:3000
```

Never commit `.env` or place backend secrets in the frontend.

### 4. Create the database schema

For a new local database:

```bash
cd backend
npx prisma migrate dev --name init
```

For an existing deployment database, use the committed migrations:

```bash
npx prisma migrate deploy
```

Optional seed command:

```bash
npm run prisma:seed
```

### 5. Run the applications

Terminal 1, backend:

```bash
cd backend
npm run start:dev
```

The API runs at `http://localhost:9000` and uses the global `/api` prefix.

Terminal 2, frontend:

```bash
cd frontend
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The local frontend variables should be:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:9000
```

## Backend Commands

Run these from `backend/`:

```bash
npm run start:dev       # development with file watching
npm run build           # compile TypeScript to dist/
npm run start:prod      # run the compiled backend
npm run lint            # run Oxlint
npm run test            # unit tests
npm run test:e2e        # end-to-end tests
npm run test:cov        # test coverage
npm run prisma:generate # regenerate Prisma Client
npm run prisma:migrate  # create/apply a development migration
```

Useful backend URLs:

- API health: `GET http://localhost:9000/api/health`
- Swagger documentation: `http://localhost:9000/api/docs`

## Frontend Commands

Run these from `frontend/`:

```bash
npm run dev             # development server
npm run lint            # ESLint
npm run build           # production build
npm run start           # serve the production build
```

## Docker

### Run the full project

From the repository root, create `backend/.env` from `backend/.env.example`, then run:

```bash
docker compose up -d --build
docker compose ps
```

Open the frontend at `http://localhost:3000`. The API is available at `http://localhost:9000` and Swagger is available at `http://localhost:9000/api/docs`.

The Compose setup starts the frontend, backend, PostgreSQL, and Redis. It applies committed Prisma migrations automatically when the backend starts.

Stop the full project with:

```bash
docker compose down
```

To also delete PostgreSQL and generated video data:

```bash
docker compose down -v
```

### Start only infrastructure

This is the recommended local workflow when developing the backend directly with Node.js:

```bash
cd backend
docker compose up -d postgres redis
npm run start:dev
```

### Run the backend container too

Create `backend/.env` first. When the backend runs inside Compose, its hostnames must use the Compose service names, not `localhost`:

```env
DATABASE_URL=postgresql://cinevo:cinevo@postgres:5432/cinevo
REDIS_HOST=redis
REDIS_PORT=6379
PORT=9000
CORS_ORIGIN=http://localhost:3000
```

Then build and start all backend services:

```bash
cd backend
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

Apply migrations against the containerized database:

```bash
docker compose run --rm backend npx prisma migrate deploy
```

Stop the stack:

```bash
docker compose down
```

Stop it and delete the local PostgreSQL volume:

```bash
docker compose down -v
```

The final command deletes local database data. Use it only when you intentionally want a clean database.

### Build the backend image manually

```bash
cd backend
docker build -t cinevo-backend .
docker run --env-file .env -p 9000:9000 cinevo-backend
```

The Docker image builds Prisma Client and the NestJS production output. It does not automatically run database migrations.

## Environment Variables

### Backend

Copy `backend/.env.example` to `backend/.env` and set values for your environment.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime environment. |
| `PORT` | API port; local default is `9000`. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime, such as `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime, such as `30d`. |
| `GEMINI_API_KEY` | Server-only Gemini credential. |
| `GEMINI_MODEL` | Gemini model name, such as `gemini-2.5-flash`. |
| `REDIS_HOST` / `REDIS_PORT` | Redis/BullMQ connection. |
| `REDIS_PASSWORD` | Optional Redis password. |
| `VIDEO_PROVIDER` | Current provider setting; local development uses `mock`. |
| `STORAGE_PROVIDER` | `local` for development or an S3-compatible provider in production. |
| `STORAGE_LOCAL_PATH` | Local output directory when local storage is enabled. |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins. |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT` | S3-compatible storage configuration. |
| `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_PUBLIC_URL` | S3 credentials and public output URL. |

### Frontend

Only public URL variables belong in `frontend/.env.local` or Vercel:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.example.com
```

Do not add `GEMINI_API_KEY`, `DATABASE_URL`, JWT secrets, Redis credentials, or S3 secret keys to the frontend.

## API Overview

The backend prefixes routes with `/api`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Register a user. |
| `POST` | `/api/auth/login` | No | Login and receive access/refresh tokens. |
| `POST` | `/api/auth/refresh` | No | Rotate a refresh token. |
| `POST` | `/api/auth/logout` | No | Revoke a refresh token. |
| `GET` | `/api/auth/me` | Yes | Get the current user. |
| `GET` | `/api/dashboard` | Yes | Get dashboard statistics and recent videos. |
| `POST` | `/api/ai/chat` | Yes | Send a message to the AI assistant. |
| `GET` | `/api/conversations` | Yes | List conversations. |
| `GET` | `/api/conversations/:id` | Yes | Get a conversation. |
| `POST` | `/api/videos` | Yes | Queue a video generation job. |
| `GET` | `/api/videos` | Yes | Search and paginate videos. |
| `GET` | `/api/videos/:id` | Yes | Get a video and its scenes. |
| `GET` | `/api/videos/:id/status` | Yes | Get generation status and progress. |
| `POST` | `/api/videos/:id/cancel` | Yes | Cancel a video. |
| `DELETE` | `/api/videos/:id` | Yes | Delete a video. |

Socket.IO video events include `video:processing`, `video:progress`, `video:completed`, and `video:failed`.

## Production Deployment

### Frontend on Vercel

Vercel is a good fit for the Next.js frontend.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Set **Root Directory** to `frontend`.
4. Keep the framework preset as **Next.js**.
5. Add these environment variables for Development, Preview, and Production:

	 ```env
	 NEXT_PUBLIC_API_URL=https://your-api-host.example.com/api
	 NEXT_PUBLIC_SOCKET_URL=https://your-api-host.example.com
	 ```

6. Deploy and verify `/`, `/login`, and `/dashboard`.
7. Add the Vercel deployment URL to the backend `CORS_ORIGIN` value and redeploy the backend.

The frontend must point to a publicly reachable HTTPS backend. A local `localhost` URL will not work from a deployed Vercel page.

### Frontend on Render

You can also deploy the frontend as a separate Render **Web Service**:

1. Create another service from the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Set **Runtime** to `Node`.
4. Set **Build Command** to `npm ci && npm run build`.
5. Set **Start Command** to `npm run start -- --hostname 0.0.0.0 --port $PORT`.
6. Add these environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-service.onrender.com
```

Render provides the frontend `PORT` automatically. Do not set the frontend API variables to `localhost` in production. Deploy the backend first, copy its public HTTPS URL, add it to the frontend variables, and then deploy the frontend.

### Backend hosting

The backend is a long-running NestJS process with Redis/BullMQ and Socket.IO. Deploy it to a host that supports persistent Node.js services and WebSockets, such as Railway, Render, Fly.io, a VPS, or a managed container platform. Vercel serverless functions are not a suitable host for this backend worker and Socket.IO gateway without a separate realtime service.

#### Render Docker setup

The repository includes a root `Dockerfile` that builds the backend from `backend/`. Use these Render Web Service settings:

1. **Environment:** `Docker`
2. **Dockerfile path:** `./Dockerfile`
3. **Docker build context:** `.`
4. **Health check path:** `/api/health`
5. **Port:** `9000` if Render asks for an explicit port

Alternatively, use the existing `backend/Dockerfile` by setting **Root Directory** to `backend`, **Dockerfile path** to `Dockerfile`, and **Docker build context** to `.`. Do not set the root directory to `frontend` for the API service.

Use Render PostgreSQL and Redis connection values in the backend environment. Do not use `localhost`, `postgres`, or `redis` for hosted services. Set `CORS_ORIGIN` to the deployed Vercel URL.

Before deploying, update these Render service variables:

```env
NODE_ENV=production
PORT=9000
DATABASE_URL=<Render PostgreSQL Internal Database URL>
REDIS_HOST=<Render Redis hostname>
REDIS_PORT=6379
CORS_ORIGIN=https://your-frontend.vercel.app
```

The local value `postgresql://...@localhost:5432/...` only works on your computer. In Render it points back to the API container, which causes Prisma error `P1001: Can't reach database server at localhost:5432`. Copy the internal connection details from the Render PostgreSQL service and Redis service, then redeploy. Run `npx prisma migrate deploy` as the Render release command before starting the web service.

Production backend requirements:

1. Provision hosted PostgreSQL.
2. Provision hosted Redis.
3. Deploy the backend with `backend/Dockerfile` or a Node.js build using `npm run build` and `npm run start:prod`.
4. Set all backend environment variables, including strong JWT secrets and `CORS_ORIGIN`.
5. Run `npx prisma migrate deploy` during deployment or as a release command.
6. Use S3-compatible storage instead of local filesystem storage for generated output.
7. Ensure the public API supports HTTPS and WebSocket upgrades.
8. Confirm `GET /api/health` returns a healthy response.
9. Set the Vercel frontend variables to the deployed API origin.

Example production CORS value:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

If you use a custom frontend domain, include that domain instead of or in addition to the Vercel URL.

## Verification Checklist

Before opening a pull request or deploying:

```bash
cd backend
npm run lint
npm run build
npm run test
npm run test:e2e

cd ../frontend
npm run lint
npm run build
```

Then manually verify:

- Register and login work.
- `/api/health` reports the database connection.
- Dashboard loads with zero videos.
- AI chat returns a response with a valid Gemini key.
- Creating a video creates a queued job.
- Progress updates arrive through Socket.IO or polling.
- Completed output is stored in durable production storage.
- The deployed frontend can call the deployed API without a CORS error.

## Security Notes

- Treat all API keys and JWT secrets as compromised if they are committed or shared publicly; rotate them immediately.
- Keep `.env`, `.env.local`, and production environment files out of version control.
- Use HTTPS in production.
- Use strong, unique JWT secrets.
- Keep Gemini and provider calls server-side.
- Use durable private storage with controlled public URLs for generated videos.

## License

This project is private and currently has no open-source license specified.
