# Chirru Portfolio — Next.js + TypeScript

Personal portfolio frontend for **Chiranjit Das**.

This branch is a full migration from the previous React + Vite JavaScript frontend to **Next.js App Router + TypeScript**. The Java/Spring Boot backend is an independent service and is **not modified by this migration**.

## Architecture

```
www.chirru.in
      │
      ▼
Next.js + TypeScript
      │
      │ HTTPS REST API
      ▼
api.chirru.in/api/v2
      │
      ▼
Java + Spring Boot backend
```

The admin application remains a separate application/domain.

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- Framer Motion
- Lucide React
- Zod
- Oxlint
- Java/Spring Boot REST API (external, unchanged)

## Routes

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/experience`
- `/contact`

Next.js also generates:

- `/robots.txt`
- `/sitemap.xml`

## Project structure

```
src/
├── app/
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── experience/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── globals.css
├── components/
├── lib/
│   └── serverApi.ts
├── pages/
├── types/
│   ├── api.ts
│   └── portfolio.ts
├── utils/
└── api.ts
```

## API configuration

Browser/client requests use:

```env
NEXT_PUBLIC_API_URL=https://api.chirru.in/api/v2
```

Optional server-side override:

```env
API_URL=https://api.chirru.in/api/v2
```

Create a local `.env.local` from `.env.example` when needed.

### Existing backend endpoints used by the frontend

- `GET /portfolio/profile`
- `GET /portfolio/projects`
- `GET /portfolio/skills`
- `GET /portfolio/experience`
- `GET /portfolio/education`
- `GET /portfolio/social-links`
- `POST /portfolio/contact`
- `GET /portfolio/resume`
- `POST /portfolio/analytics/event`

**The backend implementation and database are outside this repository and are not changed by the Next.js migration.**

## Image delivery

Portfolio images continue to use the backend image proxy:

```
Browser
  ↓
api.chirru.in/api/v2/images?id=<encoded-image-url>
  ↓
Image storage/provider
```

The frontend does not need to expose the storage provider URL directly.

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Type check:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm start
```

## TypeScript migration

The migration includes:

- JSX → TSX
- JavaScript utilities → TypeScript
- Typed API layer
- Typed portfolio models
- Typed component props
- Typed forms and events
- Next.js App Router
- `next/navigation`
- Next.js Metadata API
- Typed sitemap and robots configuration
- Server-side API fetching with revalidation
- Client/server component boundaries
- Vite/React Router/React Helmet removal
- TypeScript CI validation

The TypeScript configuration uses strict checking. Production builds are not configured to ignore TypeScript errors.

## CI

GitHub Actions validates the `next-js` branch with:

```
npm install
  ↓
npm run typecheck
  ↓
npm run lint
  ↓
npm run build
```

The workflow also regenerates `package-lock.json` when the dependency graph changes.

## Deployment

Recommended frontend:

```
https://www.chirru.in
```

Backend:

```
https://api.chirru.in
```

The two services remain independently deployable.

## Important

This repository contains only the frontend migration. **Do not change the Java/Spring Boot backend as part of this work.**

## Author

**Chiranjit Das**

- Portfolio: https://www.chirru.in/
- GitHub: https://github.com/chirru26

## License

See the repository license and project terms.
