# Chirru Portfolio — Next.js + TypeScript

Personal portfolio frontend for **Chiranjit Das**.

This branch is a full migration from the previous React + Vite JavaScript frontend to **Next.js App Router + TypeScript**.

## Architecture

```
www.chirru.in
      │
      ▼
Next.js + TypeScript
      │
      │ HTTPS REST API
      ▼
localhost:8080
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
NEXT_PUBLIC_API_URL=backend url
```

Optional server-side override:

```env
API_URL=backend url
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



## Important

This repository contains only the frontend migration. 

## Author

**Chiranjit Das**

- Portfolio: https://www.chirru.in/
- GitHub: https://github.com/heychirru

## License

See the repository license and project terms.
