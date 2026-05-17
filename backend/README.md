# Backend

The backend is a Spring Boot multi-service workspace managed by the Maven parent in `backend/pom.xml`.

## Services

- `api-gateway`: routes `/api/v1/**` requests to backend services.
- `checkin-service`: orchestrates check-in, checkout, sessions, stays, payment, keys, and kiosk-facing flows.
- `reservation-service`: owns reservation lookup and reservation test management.
- `admin-service`: owns admin authentication, dashboard aggregation, hotel context, audit, branding, and reservation administration APIs.
- `payment-service`: simulated payment adapter with Oracle persistence where applicable.
- `key-service`: simulated key issuing adapter.
- `biometry-service`: simulated biometric verification adapter.
- `pms-adapter-service`: simulated PMS adapter.
- `device-service`: kiosk device status and monitoring adapter.
- `identity-service`: identity support adapter.
- `notification-service`: notification support adapter.

## Environment

Backend services read Oracle and admin credentials from the root `.env` file or process environment:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
JPA_DDL_AUTO=update

ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
ADMIN_NAME=FlexCheck Administrator
```

Do not place real credentials in service source files, READMEs, SQL examples, or OpenSpec documents.

## Build

Build all services:

```bash
mvn -DskipTests clean package
```

Run tests:

```bash
mvn test
```

Run a single service from its folder:

```bash
cd services/checkin-service
mvn spring-boot:run
```

## Docker

The root `docker-compose.yml` builds all services from the `backend` context and each service-level `Dockerfile`.

Common published ports:

- `api-gateway`: `8088`
- `checkin-service`: `8081`
- `reservation-service`: `8082`
- `payment-service`: `8083`
- `key-service`: `8084`
- `admin-service`: `8085`
- `biometry-service`: `8086`
- `pms-adapter-service`: `8087`
- `device-service`: `8089`
- `identity-service`: `8090`
- `notification-service`: `8091`

Start everything from the repository root:

```bash
docker compose up -d --build
```

## Database

Versioned Oracle files live in `database/oracle`:

- `schema.sql`: table definitions.
- `seed.sql`: demo seed data.
- `reset.sql`: removes FlexCheck tables.
- `verify.sql`: checks table and data counts.
- `setup_fiap.sql`: reset, schema, seed, and verify sequence for manual IDE execution.
- `init`: local Oracle container bootstrap scripts.

Use `JPA_DDL_AUTO=update` for normal development against Oracle. Use reset scripts only when intentionally resetting a development schema.

## API Smoke Checks

With Docker running:

```bash
curl http://127.0.0.1:8088/gateway/health
curl http://127.0.0.1:8088/api/v1/admin/hotels
curl http://127.0.0.1:8088/api/v1/reservations/hotels/1
```

Admin login credentials are whatever was configured in `.env`.
