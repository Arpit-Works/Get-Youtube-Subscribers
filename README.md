# Get-Youtube-Subscribers

A small **Node.js** REST API for managing YouTube-style subscriber records. It uses **Express**, **MongoDB** (via Mongoose), and automated **tests**, **Docker**, and **CI/CD** so you can run it locally, in a container, or deploy to **Vercel** after every push to `main`.

## What this project covers

| Topic | What you practice |
| --- | --- |
| **Node.js & Express** | HTTP routes, JSON APIs, environment variables (`MONGO_URI`) |
| **MongoDB** | Schemas, seeding data, integration tests against a real database |
| **Docker** | Packaging the app with a `Dockerfile` for consistent runs |
| **CI/CD** | GitHub Actions: test on every PR/push, deploy to Vercel on `main` |

## Tech stack

- **Runtime:** Node.js 20
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Tests:** Mocha, Chai, chai-http
- **Deploy:** Vercel (serverless Node via `vercel.json`)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x
- [MongoDB](https://www.mongodb.com/) (local), or a cloud URI in `.env`
- For deployment: a [Vercel](https://vercel.com/) project linked to this repo

## Getting started (local)

1. Clone the repository:

```bash
git clone https://github.com/Arpit-Works/Get-Youtube-Subscribers.git
cd Get-Youtube-Subscribers
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment (create `.env` in the project root):

```env
MONGO_URI=mongodb://127.0.0.1:27017/subscribers
PORT=3000
```

4. Seed the database (MongoDB must be running):

```bash
node src/createDatabase.js
```

5. Start the server:

```bash
npm start
```

The API is available at `http://localhost:3000`.

## API endpoints

### Health check

- **GET** `/` — Returns API status and available routes.

### Get all subscribers

- **GET** `/subscribers` — Array of subscriber documents.

### Get subscriber names

- **GET** `/subscribers/names` — Subscribers with `name` and `subscribedChannel` only.

### Get subscriber by ID

- **GET** `/subscribers/:id`
  - Valid ID: single subscriber object.
  - Invalid ID: `400` with `{ "message": "..." }`.

## Tests

```bash
npm test
```

In CI, tests run against a **MongoDB service container** on GitHub Actions: dependencies install with `npm ci`, the DB is seeded, then Mocha runs the suite.

## Docker

The `Dockerfile` builds a minimal image: Node 20, `npm ci`, app code, and `npm start` on port 3000.

Build and run (set `MONGO_URI` to a host MongoDB or another container):

```bash
docker build -t get-youtube-subscribers .
docker run --rm -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/subscribers get-youtube-subscribers
```

`.dockerignore` keeps `node_modules`, `.env` files, and git metadata out of the image.

## CI/CD (GitHub Actions + Vercel)

Workflow file: `.github/workflows/ci.yml`.

### Pipeline flow

1. **Test job** (every push and pull request to `main` / `master`)
   - Spin up MongoDB
   - `npm ci` → seed DB → `npm test`

2. **Deploy job** (only on push to `main`, after tests pass)
   - `vercel pull` — production env and project settings
   - `vercel build --prod` — build artifacts in `.vercel/output`
   - `vercel deploy --prebuilt --prod` — upload prebuilt output to Vercel

### GitHub secrets

Add these under **Repository → Settings → Secrets and variables → Actions**:

| Secret | Description |
| --- | --- |
| `VERCEL_TOKEN` | [Account token](https://vercel.com/account/tokens) with access to your team (avoid project-only tokens for `vercel pull`) |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` after `vercel login` and `vercel link` |
| `VERCEL_PROJECT_ID` | `projectId` from the same file (`prj_…`) |

Do not commit `.vercel/` or `.env` files; they are listed in `.gitignore`.

### Lessons from setting up deploy

- **`vercel pull` needs the right token scope** — Project-scoped tokens often fail with “Could not retrieve Project Settings”; use a full account/team token when using the official `pull` → `build` → `deploy --prebuilt` flow.
- **IDs are not names** — `VERCEL_ORG_ID` is `team_…` or `user_…`, and `VERCEL_PROJECT_ID` is `prj_…`, not the project slug.
- **Link locally once** — Run `vercel link` to generate `.vercel/project.json`, then copy `orgId` and `projectId` into GitHub secrets.
- **Separate test and deploy** — PRs get tests only; production deploy runs only when `main` is green.

## Project layout

```
├── index.js              # Vercel entry (routes to Express app)
├── vercel.json           # Vercel serverless config
├── src/
│   ├── index.js          # Local server entry
│   ├── app.js            # Express routes and MongoDB connection
│   ├── createDatabase.js # Seed script
│   └── models/           # Mongoose models
├── __tests__/            # API tests
├── scripts/run-tests.js
├── Dockerfile
└── .github/workflows/ci.yml
```

## License

ISC
