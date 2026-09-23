# Chirru Portfolio Backend

Spring Boot REST API for a personal portfolio and private administration system.

## Technology Stack

- Java 21
- Spring Boot 3.5.x
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- Flyway database migrations
- JWT authentication
- Cloudinary media storage
- Maven
- JUnit / Spring Boot Test / Testcontainers

## Architecture

```text
React Frontend / Admin UI
          |
          | HTTPS + REST /api/v2
          v
   Spring Boot Backend
          |
     +----+---------+
     |              |
 PostgreSQL      Cloudinary
     |              |
 data/metadata   images/PDFs
```

The backend is the only application responsible for authorization, business rules, persistence, Cloudinary credentials, uploads, and administration.

## API Version

All APIs are versioned under:

```text
/api/v2
```

Blog functionality is intentionally not part of this backend.

---

# Features

## Public Portfolio

The API supports public portfolio content for:

- Profile
- Projects
- Project case studies
- Skills
- Experience
- Education
- Certifications
- Social links
- SEO metadata
- Project tags
- Public search
- Active resume
- Contact submission
- Visitor analytics events

## Admin CMS

The private admin API supports:

- Dashboard statistics
- Profile management
- Project CRUD
- Project case studies
- Skills management
- Experience management
- Education management
- Certification management
- Project tags
- Featured content
- Social links
- SEO settings
- Contact/message inbox
- Resume versions
- Cloudinary media management
- Notifications
- Global search
- Audit logs

## Project Case Studies

Projects can contain detailed case-study information such as:

- Problem
- Solution
- Features
- Architecture
- Challenges
- Results
- Screenshots/media
- Technologies
- GitHub URL
- Live/demo URL

## Project Tags

Projects can be associated with reusable tags for filtering and search.

Example:

```text
Java
Spring Boot
React
PostgreSQL
JWT
Cloudinary
```

## Featured Content

Portfolio content can be marked/configured as featured so the public application can show selected projects and content prominently.

## Contact Inbox

Public visitors can submit contact messages. Admin APIs provide message management and notification support.

## Resume Management

Multiple resume versions can be stored as Cloudinary-backed records.

The active resume is exposed publicly through:

```http
GET /api/v2/portfolio/resume
```

The endpoint redirects to the active Cloudinary file.

Resume downloads can be tracked through analytics events.

## Analytics

The backend supports portfolio analytics events including page/project views and resume downloads.

Admin dashboard analytics can aggregate stored events for statistics and reporting.

## SEO

SEO settings can be maintained per page, including metadata used by the public application.

## Social Links

Social profiles are managed from the backend instead of being hard-coded in the frontend.

## Global Search

Portfolio search can search configured public content and admin users with the appropriate authorization.

## Notifications

The backend supports persistent admin notifications, including unread/read state.

---

# Cloudinary Media Storage

Actual files are stored in Cloudinary. PostgreSQL stores the file metadata and Cloudinary identifiers.

The folder convention is:

```text
chirru-portfolio/
├── profile/
├── projects/
├── certifications/
├── resume/
└── documents/
```

Media records keep values such as:

- URL
- Cloudinary public ID
- Folder
- Resource type
- Original filename
- MIME type
- File size

This allows the backend to replace or delete a Cloudinary asset without leaving orphaned references.

### Upload limits

| Type | Allowed formats | Maximum |
|---|---|---:|
| Image | JPEG, PNG, WebP | 5 MB |
| Resume/document | PDF | 10 MB |

Cloudinary API secrets never reach the React applications.

---

# Admin Security

The admin API is protected by Spring Security and `ROLE_ADMIN`.

Protected endpoints follow:

```text
/api/v2/admin/**
```

Security features include:

- JWT access authentication
- Short-lived access tokens
- Refresh-token rotation
- HttpOnly refresh cookie
- Refresh-token revocation
- Role-based authorization
- BCrypt password hashing
- Login rate limiting
- Temporary login lockout
- CORS restrictions
- Security headers
- Server-side request validation
- Upload type/size validation
- Admin audit logging

The admin UI being located at `/admin` is not considered a security boundary. Authorization is enforced by the backend.

## Authentication Flow

```text
Admin Login
    |
    +--> short-lived access JWT
    |
    +--> HttpOnly refresh cookie
             |
             v
       refresh / rotation
```

The refresh token is not stored in browser localStorage.

---

# Audit Logs

Administrative mutations and security-sensitive actions can be recorded in the audit log.

Admin endpoint:

```http
GET /api/v2/admin/audit-logs
```

Example actions include:

```text
LOGIN
CREATE_PROJECT
UPDATE_PROJECT
DELETE_PROJECT
UPLOAD_MEDIA
DELETE_MEDIA
UPDATE_PROFILE
DELETE_RESUME
```

---

# Environment Configuration

Sensitive values must not be committed to Git.

Copy the example configuration:

```bash
cp .env.example .env
```

Typical values include:

```env
DB_URL=jdbc:postgresql://localhost:5432/chirru_portfolio
DB_USERNAME=chirru
DB_PASSWORD=change-me

JWT_SECRET=change-me-to-a-long-random-secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`application.yml` should reference environment variables rather than containing real secrets.

For production, use the hosting provider's secret/environment-variable manager instead of committing or uploading a real `.env` file.

---

# Database

PostgreSQL is the primary persistent store.

Flyway manages schema changes from:

```text
src/main/resources/db/migration/
```

Never manually edit an already-applied Flyway migration. Add a new migration for schema changes.

---

# Important API Groups

## Authentication

```text
POST /api/v2/auth/login
POST /api/v2/auth/refresh
POST /api/v2/auth/logout
```

## Public Portfolio

```text
GET /api/v2/portfolio/profile
GET /api/v2/portfolio/projects
GET /api/v2/portfolio/skills
GET /api/v2/portfolio/experience
GET /api/v2/portfolio/education
GET /api/v2/portfolio/certifications
GET /api/v2/portfolio/social-links
GET /api/v2/portfolio/seo
GET /api/v2/portfolio/resume
GET /api/v2/portfolio/search
POST /api/v2/portfolio/contact
POST /api/v2/portfolio/analytics/event
```

## Admin

```text
GET /api/v2/admin/dashboard
GET /api/v2/admin/analytics
GET /api/v2/admin/audit-logs
GET /api/v2/admin/media
GET /api/v2/admin/resumes
GET /api/v2/admin/notifications
GET /api/v2/admin/search
```

Additional CRUD endpoints are available for portfolio entities and management features.

---

# Running Locally

Requirements:

- JDK 21
- Maven 3.9+
- PostgreSQL
- Cloudinary account for media features

Run:

```bash
mvn clean test
```

Then:

```bash
mvn spring-boot:run
```

Default development server:

```text
http://localhost:8080
```

API base URL:

```text
http://localhost:8080/api/v2
```

---

# Testing

Run the full test suite with:

```bash
mvn clean test
```

Testcontainers can be used for PostgreSQL integration tests.

Before production deployment, verify:

1. All tests pass.
2. Flyway migrations apply to a clean database.
3. No real secrets exist in Git history.
4. CORS contains only trusted frontend origins.
5. Cloudinary credentials are configured as deployment secrets.
6. JWT secret is long and randomly generated.
7. HTTPS is enabled.
8. Database backups are configured.

---

# Project Structure

```text
src/main/java/com/chirru/portfolio/
├── config/
├── controller/
├── dto/
├── entity/
├── repository/
├── security/
└── service/

src/main/resources/
└── db/migration/
```

The project intentionally keeps the backend independent from the React Frontend and Admin applications.

---

# Deployment

Recommended production architecture:

```text
                Internet
                   |
                 HTTPS
                   |
          +--------+--------+
          |                 |
     Public React       Admin React
          |                 |
          +--------+--------+
                   |
                   v
            Spring Boot API
                   |
          +--------+--------+
          |                 |
      PostgreSQL        Cloudinary
```

The frontend and admin applications never receive database credentials, JWT signing secrets, or Cloudinary API secrets.

---

# Roadmap

Completed backend scope:

- [x] Spring Boot API
- [x] PostgreSQL persistence
- [x] Flyway migrations
- [x] `/api/v2` API versioning
- [x] JWT admin authentication
- [x] Refresh-token security
- [x] Admin role authorization
- [x] Login protection
- [x] Audit logging
- [x] Portfolio CRUD foundation
- [x] Project case studies
- [x] Project tags
- [x] Featured content
- [x] Cloudinary media storage
- [x] Resume versions
- [x] Resume download tracking
- [x] Contact inbox
- [x] Notifications
- [x] Analytics
- [x] SEO settings
- [x] Social links
- [x] Global search
- [x] Validation/error handling
- [x] Public active-resume endpoint

Not included:

- [ ] Blog / Articles

The frontend and admin applications are maintained separately from this backend repository.
