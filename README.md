# FlexCheck Hotel Platform

FlexCheck is a hotel kiosk and administration platform for reservation lookup, check-in, checkout, operational monitoring, and test reservation management. The current runtime is Docker-first and persists operational data in Oracle.

## Repository Structure

- `backend`: Spring Boot services and the Maven parent build.
- `frontend`: Kiosk and administration React applications.
- `database`: Oracle schema, seed, reset, and local bootstrap scripts.
- `infra`: Docker templates and infrastructure support files.
- `openspec`: product and implementation history.
- `docs`: supporting historical notes, diagrams, and API collections.

## Required Environment

Create a local `.env` file in the repository root:

```bash
cp .env.example .env
```

Fill the values with local or FIAP Oracle credentials:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
JPA_DDL_AUTO=update

ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
ADMIN_NAME=FlexCheck Administrator

KIOSK_PORT=3000
ADMIN_WEB_PORT=3001
GATEWAY_PORT=8088
```

Keep `.env` private. Do not commit real database credentials, admin credentials, tokens, or local secrets.

## Run With Docker

Start the full application stack:

```bash
docker compose up -d --build
```

Main URLs:

- Kiosk: `http://127.0.0.1:3000`
- Admin portal: `http://127.0.0.1:3001`
- API gateway: `http://127.0.0.1:8088`
- Check-in service: `http://127.0.0.1:8081`
- Reservation service: `http://127.0.0.1:8082`
- Admin service: `http://127.0.0.1:8085`

Stop the stack:

```bash
docker compose down
```

Rebuild from scratch when Docker images are stale:

```bash
docker compose build --no-cache
docker compose up -d
```

## Optional Local Oracle

The default stack expects an Oracle database configured through `.env`. A local Oracle container is available behind the `oracle-local` profile:

```bash
docker compose --profile oracle-local up -d oracle-db
```

For local Oracle, set:

```env
ORACLE_SYS_PASSWORD=your_local_oracle_sys_password
ORACLE_URL=jdbc:oracle:thin:@oracle-db:1521/FREEPDB1
ORACLE_USER=flexcheck_app
ORACLE_PASSWORD=change_me_local_password
```

The local bootstrap scripts in `database/oracle/init` create the local application schema and load the versioned schema and seed data. For shared FIAP Oracle usage, use your own schema credentials and run only the scripts that are safe for that environment.

## Build Locally

Backend:

```bash
cd backend
mvn -DskipTests clean package
```

Kiosk:

```bash
cd frontend/kiosk-web
npm install
npm run build
```

Admin portal:

```bash
cd frontend/admin-web
npm install
npm run build
```

## Current Product Flows

- Kiosk home with hotel branding and language switching.
- Check-in reservation lookup by CPF, reservation number, and QR token.
- Check-in reservation summary before facial verification.
- Checkout lookup, account review, payment path, key return, receipt, and completion screens.
- Shared kiosk error screen for check-in and checkout failures.
- Admin login, dashboard, hotel context selection, device/audit/branding views, and persistent reservation test area.

## Documentation

Use the root README for Docker, database, and project-wide setup. Use `backend/README.md` for backend service details and `frontend/README.md` for kiosk/admin development details. OpenSpec remains the source of implementation history and change decisions.
