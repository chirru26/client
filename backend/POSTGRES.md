# PostgreSQL with Docker

This guide runs PostgreSQL locally for the Spring Boot backend.

## 1. Requirements

Install Docker Desktop and make sure Docker Engine is running.

Check:

```bash
docker --version
docker compose version
```

## 2. Start PostgreSQL

From the `backend` directory:

```bash
docker compose up -d postgres
```

Check the container:

```bash
docker compose ps
```

You should see `portfolio-postgres` with a healthy status.

## 3. Database connection

The Docker container exposes PostgreSQL on your machine at port `5432`.

Development connection:

```
Host: localhost
Port: 5432
Database: portfolio
Username: portfolio
Password: portfolio_dev_password
JDBC URL: jdbc:postgresql://localhost:5432/portfolio
```

Add/update these values in your backend `.env` (or the environment variables used by your Spring Boot configuration):

```env
DB_URL=jdbc:postgresql://localhost:5432/portfolio
DB_USERNAME=portfolio
DB_PASSWORD=portfolio_dev_password
```

If your current `application.yml` uses different environment-variable names, keep those names and only change their values.

## 4. Start the Spring Boot backend

With PostgreSQL running:

```bash
cd backend
mvn spring-boot:run
```

Spring Boot should connect to PostgreSQL on `localhost:5432`.

Flyway migrations will run automatically if Flyway is enabled in the application configuration.

## 5. Check PostgreSQL directly

Open a PostgreSQL shell inside the container:

```bash
docker exec -it portfolio-postgres psql -U portfolio -d portfolio
```

Useful commands:

```sql
\\dt
SELECT current_database();
\\q
```

## 6. Stop PostgreSQL

Stop the database without deleting its data:

```bash
docker compose stop postgres
```

Start it again:

```bash
docker compose start postgres
```

## 7. Remove the container

To remove the container while keeping the named volume:

```bash
docker compose down
```

To remove the container **and all local PostgreSQL data**:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` permanently removes the local PostgreSQL volume.

## 8. Connection from another Docker container

If the Spring Boot backend is also running inside the same Compose project, do **not** use `localhost` for PostgreSQL.

Use the Compose service name:

```
jdbc:postgresql://postgres:5432/portfolio
```

The service name `postgres` is the internal Docker DNS hostname.

## 9. Recommended development workflow

```bash
cd backend

# Start database
docker compose up -d postgres

# Start backend
mvn spring-boot:run
```

When finished:

```bash
docker compose stop postgres
```

## Troubleshooting

### Port 5432 is already in use

Check what is using the port:

```bash
netstat -ano | findstr :5432
```

Either stop the existing PostgreSQL service or change the host port in `docker-compose.yml`, for example:

```yaml
ports:
  - "5433:5432"
```

Then use:

```
jdbc:postgresql://localhost:5433/portfolio
```

### Spring Boot cannot connect

Check:

```bash
docker compose ps
docker compose logs postgres
```

Make sure PostgreSQL is healthy before starting Spring Boot.

### Need a clean database

Only for local development:

```bash
docker compose down -v
docker compose up -d postgres
```

This deletes the existing database volume and lets Flyway recreate the schema from the migration files.
