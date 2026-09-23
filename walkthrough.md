# Walkthrough: Backend to Frontend Data Synchronization & Bug Fixes

We have resolved all data synchronization, communication, serialization, and presentation issues between the Spring Boot backend (`http://localhost:8080/api/v2`) and the Next.js frontend (`http://localhost:3000`).

---

## Key Problems Identified & Root Causes

1. **Supabase PgBouncer Prepared Statement Collisions (`PSQLException: ERROR: prepared statement "S_1" already exists`)**
   - **Root Cause**: Supabase transaction pooling on port `6543` does not support server-side prepared statements across pooled sessions.
   - **Fix**: Added `prepareThreshold=0` to the JDBC connection string in `backend/.env` and configured `dataSourceProperties.prepareThreshold: 0` in [application.yml](file:///c:/Users/chira/Desktop/client/backend/src/main/resources/application.yml).

2. **CORS Mismatch & Origin Trailing Slash**
   - **Root Cause**: `CORS_ALLOWED_ORIGINS` had trailing slashes (`http://localhost:3000/`), preventing browser pre-flight checks and CORS validation from matching `http://localhost:3000`.
   - **Fix**: Updated `CORS_ALLOWED_ORIGINS` in `backend/.env` and added defensive trailing-slash normalization in [CorsConfig.java](file:///c:/Users/chira/Desktop/client/backend/src/main/java/com/chirru/portfolio/config/CorsConfig.java).

3. **Missing Resume & Profile Image Media Resolution (404 on Resume)**
   - **Root Cause**: The `profile` table stored `/api/v2/media/1` in `resume_public_id` and an empty string in `resume_url`, while `resume_versions` was empty. The resume controller only checked `profile.resume_url` when it was not null or blank, causing 404s.
   - **Fix**:
     - Updated [MediaService.java](file:///c:/Users/chira/Desktop/client/backend/src/main/java/com/chirru/portfolio/service/MediaService.java) with `findIdByPublicIdOrUrl` and numeric/path extraction.
     - Updated [PublicResumeController.java](file:///c:/Users/chira/Desktop/client/backend/src/main/java/com/chirru/portfolio/controller/PublicResumeController.java) to fall back across `resume_versions` -> `profile` -> `media_assets`.
     - Created Flyway migration [V10__fix_profile_resume_data.sql](file:///c:/Users/chira/Desktop/client/backend/src/main/resources/db/migration/V10__fix_profile_resume_data.sql) and [V9__seed_portfolio_data.sql](file:///c:/Users/chira/Desktop/client/backend/src/main/resources/db/migration/V9__seed_portfolio_data.sql) to sync resume and profile image public IDs.

4. **SEO Page Lookup 500 Error**
   - **Root Cause**: `FeatureManagementService.seo(pageKey)` threw `EmptyResultDataAccessException` when a requested page key was missing in `seo_settings`.
   - **Fix**: Modified [FeatureManagementService.java](file:///c:/Users/chira/Desktop/client/backend/src/main/java/com/chirru/portfolio/service/FeatureManagementService.java) to handle empty results gracefully and return default fallback metadata.

5. **Project Identifier Lookup (Slug vs Numeric ID)**
   - **Root Cause**: Next.js project detail routes could request projects by slug (e.g., `/projects/social-media-dashboard`) while the backend only supported numeric IDs.
   - **Fix**: Updated `@GetMapping("/projects/{identifier}")` in [PublicPortfolioController.java](file:///c:/Users/chira/Desktop/client/backend/src/main/java/com/chirru/portfolio/controller/PublicPortfolioController.java) to parse numeric IDs first and fall back to clean title-slug matching.

6. **Frontend Image Loader & Fallback**
   - **Root Cause**: `next/image` was rejecting Cloudinary URLs not configured in `remotePatterns`, and `imageUtils.ts` wasn't routing Cloudinary or relative media paths properly.
   - **Fix**: Updated [next.config.ts](file:///c:/Users/chira/Desktop/client/frontend/next.config.ts) and [imageUtils.ts](file:///c:/Users/chira/Desktop/client/frontend/src/utils/imageUtils.ts). Also replaced the misleading "Server Offline" message in [Project.tsx](file:///c:/Users/chira/Desktop/client/frontend/src/components/Project.tsx) with a proper empty state.

---

## Verification & Test Results

### 1. Automated Backend Tests
Ran `mvn test -Dtest=PortfolioApplicationTests`:
```
[INFO] Running com.chirru.portfolio.PortfolioApplicationTests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 24.18 s
[INFO] BUILD SUCCESS
```
All endpoints passed with status 200:
- `testProfileEndpoint`: Profile metadata + image URL verification
- `testSkillsEndpoint`: 13 skills returned with correct category & icon
- `testSeoEndpoint`: SEO title and description populated
- `testResumeEndpoint`: Resume streaming returns 200 with `application/pdf`
- `testContactEndpoint`: Message submission persists successfully

### 2. Live HTTP Endpoint Verification
- `GET /api/v2/portfolio/profile` -> **200 OK** (Returns Chiranjit Das profile data, `imageUrl: /api/v2/media/2`)
- `GET /api/v2/portfolio/resume` -> **200 OK** (`Content-Type: application/pdf`, `Content-Disposition: inline; filename="Cv.pdf"`)
- `GET /api/v2/media/2` -> **200 OK** (`Content-Type: image/jpeg`)
- `GET /api/v2/portfolio/skills` -> **200 OK** (13 skills returned across Backend, Frontend, DevOps, Databases, and Tools)
- `GET /api/v2/portfolio/seo?page=home` -> **200 OK** (Returns canonical title & description)
- `POST /api/v2/portfolio/contact` -> **200 OK** (`{"message":"Your message has been received."}`)

### 3. Frontend Browser Verification
Verified on `http://localhost:3000/` using the browser subagent:
- **Hero Section**: Displays "Chiranjit Das", headline, and profile picture rendered crisply without errors.
- **Skills Section**: Renders all 13 skill badges (Java, Spring Boot, PostgreSQL, Docker, Microservices, React, etc.).
- **Projects Section**: Displays featured project cards with live demo & GitHub repository links, free of errors or crash alerts.
- **Resume Button**: Correctly links to the streaming PDF endpoint `/api/v2/portfolio/resume`.
