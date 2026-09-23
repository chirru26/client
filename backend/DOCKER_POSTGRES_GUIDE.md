# Docker PostgreSQL Guide

This guide runs PostgreSQL for the Spring Boot backend without installing PostgreSQL directly on the host machine.

## 1. Requirements

Install Docker Desktop and make sure the Docker engine is running.

Verify:

```bash
docker --version
docker compose version
```

## 2. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

Check the container:

```bash
docker compose ps
```

You should see `chirru-postgres` with a healthy status.

Check the database directly:

```bash
docker exec -it chirru-postgres pg_isready -U chirru -d chirru_portfolio
```

Expected result:

```text
/var/run/postgresql:5432 - accepting connections
```

## 3. Spring Boot configuration

The current local Spring Boot configuration expects PostgreSQL on `localhost:5432`.

In `backend/.env` use:

```env
DB_URL=jdbc:postgresql://localhost:5432/chirru_portfolio
DB_USERNAME=chirru
DB_PASSWORD=change-me-local
```

Keep `.env` local. Never commit real passwords or other secrets.

## 4. Start the backend

Open a second terminal:

```bash
cd backend
mvn spring-boot:run
```

Spring Boot connects to the Docker PostgreSQL container through the published host port.

Flyway will run the database migrations automatically when the application starts.

## 5. Verify the database

Connect with psql inside the container:

```bash
docker exec -it chirru-postgres psql -U chirru -d chirru_portfolio
```

Useful commands:

```sql
\dt
SELECT version();
\q
```

After Spring Boot starts, `\dt` should show the tables created by Flyway.

## 6. Stop PostgreSQL

Stop the container without deleting the database:

```bash
docker compose stop postgres
```

Start it again:

```bash
docker compose start postgres
```

Or stop the Compose service:

```bash
docker compose down
```

The named Docker volume keeps the database data when you run `docker compose down`.

## 7. Delete the database completely

**Warning:** this permanently deletes the local PostgreSQL data.

```bash
docker compose down -v
```

Then recreate it:

```bash
docker compose up -d postgres
```

Flyway will create the schema again when Spring Boot starts.

## 8. Change the local credentials

You can override the defaults without editing the Compose file:

PowerShell:

```powershell
$env:POSTGRES_DB="chirru_portfolio"
$env:POSTGRES_USER="chirru"
$env:POSTGRES_PASSWORD="your-local-password"
docker compose up -d postgres
```

If you change credentials after the database volume has already been initialized, remove the volume first or update the existing PostgreSQL role manually. PostgreSQL only uses the initialization environment variables when the data directory is created.

For a simple local reset:

```bash
docker compose down -v
docker compose up -d postgres
```

Then set matching values in `backend/.env`.

## 9. Useful commands

View logs:

```bash
docker compose logs -f postgres
```

Check status:

```bash
docker compose ps
```

Open a PostgreSQL shell:

```bash
docker exec -it chirru-postgres psql -U chirru -d chirru_portfolio
```

Restart PostgreSQL:

```bash
docker compose restart postgres
```

## 10. Architecture

Local development now looks like:

```text
Next.js
  |
  | http://localhost:3000
  v
Spring Boot
  |
  | JDBC localhost:5432
  v
Docker
  |
  v
PostgreSQL 17
  |
  +--> chirru-postgres-data volume
```

Cloudinary remains responsible for uploaded media. PostgreSQL stores application data and media metadata.

## 11. Important production note

This Compose file is intended for local development.

For production, use a managed PostgreSQL service or a separately managed database with:

- strong credentials
- private networking where possible
- TLS
- backups
- monitoring
- controlled database access
- secrets managed by the hosting platform

Do not expose a production PostgreSQL server publicly just because local development maps port `5432`.
