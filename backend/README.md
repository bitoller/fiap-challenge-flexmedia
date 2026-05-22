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
SENSITIVE_DATA_SECRET=change_me_to_a_long_random_sensitive_data_secret

ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
ADMIN_NAME=FlexCheck Administrator
```

Do not place real credentials in service source files, READMEs, SQL examples, or OpenSpec documents.

`SENSITIVE_DATA_SECRET` protects reservation-scoped document, contact, and biometric reference data. Use a long random value and keep the same value across `reservation-service` and `checkin-service`; changing it after data exists prevents old encrypted values from being decoded.

Identity verification is configured from the same root `.env`:

```env
IDENTITY_DEMO_AUTO_APPROVE=false
IDENTITY_DOCUMENT_ONLY_FALLBACK_ENABLED=true
OCR_SPACE_API_KEY=your_ocr_space_key
COMPREFACE_URL=http://host.docker.internal:8000
COMPREFACE_API_KEY=your_compreface_face_verification_key
COMPREFACE_THRESHOLD=85
```

Use `host.docker.internal` for CompreFace when the check-in service runs in Docker. Use `http://localhost:8000` only when running the check-in service directly on the host machine. No Oracle migration is required to enable OCR.space or CompreFace.

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

## Check-In Identity Verification

The active check-in path is:

1. Locate an open reservation by CPF, reservation number, or QR token.
2. Review the compact reservation summary.
3. Capture a physical document with photo.
4. OCR extracts name and CPF and compares them with the reservation holder.
5. Capture a selfie.
6. CompreFace compares the selfie with the document face.
7. If document and face match, the guest accepts inline stay terms and biometric consent.
8. The flow continues to the existing next check-in step.

The previous long contact review and standalone terms pages are no longer active in the kiosk. The legacy backend endpoints for guest confirmation and consent registration remain available as compatibility contracts, but the kiosk now uses the identity verification endpoints.
