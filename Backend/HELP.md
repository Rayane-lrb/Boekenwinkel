# Backend configuration

The backend reads configuration from `src/main/resources/application.properties`.

## Local preview

The default configuration uses an in-memory H2 database on port `8080`. Data is
cleared when the backend stops. Set `JWT_SECRET` to a private key of at least
32 bytes before starting the application.

## MySQL

Set these environment variables to use MySQL instead of the local H2 database:

- `DB_URL` (for example `jdbc:mysql://localhost:3306/boekenwinkel?createDatabaseIfNotExist=true`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DRIVER` (usually `com.mysql.cj.jdbc.Driver`)
- `JWT_SECRET` (private signing key; do not commit it)
- `JWT_EXPIRATION` (milliseconds; defaults to one day)

The application updates the schema automatically with Hibernate. For production,
use a migration tool and configure schema validation rather than automatic updates.

## Authentication

After signing in, send the returned JWT as a bearer token. `GET /auth/me` returns
the authenticated user's profile and roles; the frontend uses these roles to
show permitted navigation and protect restricted pages.

## Tests

Repository tests use Testcontainers and require Docker. The user-details unit
test can run without Docker:

```powershell
.\mvnw.cmd -Dtest=CustomUserDetailsServiceTest test
```
