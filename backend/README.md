# FlexCheck - Backend

The FlexCheck backend is a Spring Boot multi-service platform responsible for hotel reservations, check-in, checkout, identity verification, payment simulation, key issuing, admin operations, device monitoring, and Oracle persistence.

The services are organized under a Maven parent project and can be built together or individually. Docker Compose is the recommended way to run the complete backend locally.

## Project Functionalities

The backend provides the following capabilities:

- API Gateway: Routes frontend requests from `/api/v1/**` to the appropriate backend service.
- Reservation Management: Stores and searches hotel reservations by hotel, CPF, reservation code, QR token, and lifecycle status.
- Check-In Orchestration: Manages kiosk sessions, reservation validation, add-ons, payment, room access, stay activation, and key issuing.
- Identity Verification: Validates OCR document data against the reservation and compares selfie data with document face data.
- Checkout Orchestration: Finds active stays, calculates open charges, processes checkout payment, releases rooms, and closes stays.
- Admin Authentication: Validates administrator credentials configured through environment variables.
- Admin Dashboard APIs: Provides hotel context, dashboard data, device status, audit placeholders, branding placeholders, and reservation test management.
- Payment Adapter: Simulates payment processing and persists payment events where applicable.
- Key Adapter: Simulates room key issuing and key lifecycle operations.
- Device Adapter: Provides kiosk device status and monitoring data.
- PMS Adapter: Simulates hotel property management system communication.
- Notification Adapter: Supports concierge and assistance notifications.
- Oracle Persistence: Persists operational data and protects sensitive reservation-scoped information.

## Technologies and Tools Used

- `Java 21`: Backend runtime.
- `Spring Boot 3.4.5`: Service framework.
- `Spring Web`: REST API layer.
- `Spring Data JPA`: Persistence layer.
- `Maven`: Multi-module build and dependency management.
- `Oracle JDBC 23.6.0.24.10`: Oracle database driver.
- `Oracle Database`: Main database.
- `Docker` and `Docker Compose`: Local runtime orchestration.
- `OCR.space`: OCR provider for document extraction.
- `CompreFace`: Local face verification provider.

## Project Status

The backend currently supports the implemented kiosk check-in and checkout flows, admin login, admin reservation testing, Oracle persistence, OCR document verification, CompreFace facial verification, and Docker execution.

## Backend Folder Architecture

```text
backend/
  README.md
  pom.xml
  services/
    api-gateway/
    admin-service/
    biometry-service/
    checkin-service/
    device-service/
    identity-service/
    key-service/
    notification-service/
    payment-service/
    pms-adapter-service/
    reservation-service/
```

Each service follows a Spring Boot structure:

```text
service-name/
  Dockerfile
  pom.xml
  src/
    main/
      java/
        br/com/fiap/flexcheck/<service>/
      resources/
        application.yml
    test/
```

Common package responsibilities:

- `config`: Spring configuration classes.
- `controller`: REST API controllers.
- `domain`: Domain entities, exceptions, and domain services.
- `dto`: Request and response contracts.
- `infrastructure`: External clients, persistence adapters, and integration code.
- `mapper`: Data conversion between entities, DTOs, and domain objects.
- `repository`: Repository contracts or Spring Data repositories.
- `security`: Security support and sensitive data handling.
- `service`: Application services and orchestration logic.

Not every service contains every package. Smaller adapter services keep only the packages they need.

## Services

- `api-gateway`: Public routing layer for frontend requests.
- `admin-service`: Admin authentication, dashboard, hotel context, audit, branding, and reservation management APIs.
- `biometry-service`: Biometric support adapter.
- `checkin-service`: Main kiosk orchestration service for check-in and checkout.
- `device-service`: Kiosk device status and monitoring adapter.
- `identity-service`: Identity support adapter.
- `key-service`: Key issuing adapter.
- `notification-service`: Notification and assistance adapter.
- `payment-service`: Payment simulation adapter.
- `pms-adapter-service`: PMS integration adapter.
- `reservation-service`: Reservation persistence, lookup, and admin test reservation management.

## Open and Run the Backend

Install the following tools:

- Java 21
- Maven 3.9 or newer
- Docker Desktop
- Oracle access credentials or the optional local Oracle container

Clone the repository:

```bash
git clone <repository-url>
cd fiap-challenge-flexmedia
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your local credentials and secrets.

Start all backend services through Docker:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Stop the backend:

```bash
docker compose down
```

## Environment Configuration

Backend services read configuration from the root `.env` file or process environment variables.

Minimum required values:

```env
COMPOSE_PROJECT_NAME=flexcheck
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
JPA_DDL_AUTO=update
JWT_SECRET=change_me_to_a_long_random_value
SENSITIVE_DATA_SECRET=change_me_to_a_long_random_sensitive_data_secret
ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
ADMIN_NAME=FlexCheck Administrator
```

Service mode values:

```env
PMS_MODE=MOCK
PAYMENT_MODE=MOCK
BIOMETRY_MODE=MOCK
KEY_ISSUER_MODE=MOCK
IDENTITY_DEMO_AUTO_APPROVE=false
IDENTITY_DOCUMENT_ONLY_FALLBACK_ENABLED=true
```

Identity verification values:

```env
OCR_SPACE_API_KEY=your_ocr_space_key
COMPREFACE_URL=http://host.docker.internal:8000
COMPREFACE_API_KEY=your_compreface_face_verification_key
COMPREFACE_THRESHOLD=85
```

Port values:

```env
CHECKIN_PORT=8081
GATEWAY_PORT=8088
RESERVATION_PORT=8082
PAYMENT_PORT=8083
KEY_PORT=8084
ADMIN_PORT=8085
BIOMETRY_PORT=8086
PMS_PORT=8087
DEVICE_PORT=8089
IDENTITY_PORT=8090
NOTIFICATION_PORT=8091
```

Security notes:

- Do not commit `.env`.
- Do not use real credentials in source code.
- `SENSITIVE_DATA_SECRET` protects reservation-scoped document, contact, and biometric reference data.
- Keep `SENSITIVE_DATA_SECRET` unchanged after data exists, otherwise existing encrypted values cannot be decoded.
- Use long random values for `JWT_SECRET` and `SENSITIVE_DATA_SECRET`.

## Database Setup

Database scripts are located in:

```text
database/oracle
```

Files:

- `schema.sql`: Creates the Oracle schema objects.
- `seed.sql`: Inserts demo data.
- `reset.sql`: Removes FlexCheck tables from a development schema.
- `verify.sql`: Checks the current database state.
- `setup_fiap.sql`: Manual setup helper for FIAP Oracle.
- `session_count.sql`: Session inspection helper.
- `init`: Local Oracle container initialization scripts.

For shared Oracle environments:

1. Create or use your own schema.
2. Copy `.env.example` to `.env`.
3. Set `ORACLE_URL`, `ORACLE_USER`, and `ORACLE_PASSWORD`.
4. Run the schema scripts only if your schema is ready to be initialized or reset.
5. Use `JPA_DDL_AUTO=update` for normal development.

For local Oracle:

```bash
docker compose --profile oracle-local up -d oracle-db
```

Then configure:

```env
ORACLE_SYS_PASSWORD=your_local_oracle_sys_password
ORACLE_URL=jdbc:oracle:thin:@oracle-db:1521/FREEPDB1
ORACLE_USER=flexcheck_app
ORACLE_PASSWORD=change_me_local_password
```

The local Oracle container mounts `database/oracle/init` and bootstraps the local schema.

## Identity Verification Setup

### OCR.space

Create a free OCR.space API key:

```text
https://ocr.space/ocrapi/freekey
```

Add it to `.env`:

```env
OCR_SPACE_API_KEY=your_ocr_space_key
```

Without this key, real document verification cannot approve the document step.

### CompreFace

Install the local CompreFace bundle:

```powershell
.\infra\compreface\download-compreface.ps1
```

Start CompreFace:

```powershell
.\infra\compreface\start-compreface.ps1
```

Open:

```text
http://localhost:8000
```

Create a Face Verification service and copy the generated service API key into `.env`:

```env
COMPREFACE_URL=http://host.docker.internal:8000
COMPREFACE_API_KEY=your_compreface_face_verification_key
COMPREFACE_THRESHOLD=85
```

Use `host.docker.internal` when `checkin-service` runs in Docker. Use `http://localhost:8000` only when running `checkin-service` directly on your machine.

## Build the Backend

Build all backend services from the `backend` folder:

```bash
cd backend
mvn -DskipTests clean package
```

Run all backend tests:

```bash
cd backend
mvn test
```

Build one service:

```bash
cd backend
mvn -pl services/checkin-service -am -DskipTests package
```

Run one service locally:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

When running one service locally, make sure all required dependencies are reachable. In most cases, keep the rest of the stack running in Docker.

## Docker Runtime

Start the full platform from the repository root:

```bash
docker compose up -d --build
```

Start only backend services and the API gateway:

```bash
docker compose up -d --build api-gateway
```

Rebuild a single service:

```bash
docker compose up -d --build checkin-service
```

View logs:

```bash
docker logs flexcheck-checkin-service --tail 100
```

Stop everything:

```bash
docker compose down
```

## Service Ports

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

Inside Docker, services communicate through container names and internal ports. From the host machine, use the published ports above.

## API Smoke Checks

With Docker running, check the gateway:

```bash
curl http://127.0.0.1:8088/gateway/health
```

Check admin hotel data:

```bash
curl http://127.0.0.1:8088/api/v1/admin/hotels
```

Check reservations for hotel `1`:

```bash
curl http://127.0.0.1:8088/api/v1/reservations/hotels/1
```

Check the kiosk through the frontend:

```text
http://127.0.0.1:3000
```

Check the admin portal:

```text
http://127.0.0.1:3001
```

## Main Backend Flows

Check-in:

1. The kiosk creates a check-in session.
2. The guest locates an open reservation by CPF, reservation code, or QR token.
3. The backend validates that the reservation belongs to the selected hotel and is available.
4. The guest reviews the reservation summary.
5. The guest captures a document.
6. OCR data is matched against reservation name and CPF.
7. The guest captures a selfie.
8. CompreFace compares selfie and document face.
9. The guest accepts stay terms and biometric consent.
10. Optional add-ons are attached to the reservation.
11. Payment is simulated.
12. The stay is activated and room access information is returned.

Checkout:

1. The guest locates an active stay by CPF or facial verification.
2. The backend calculates only charges still open after check-in.
3. Payment is simulated if a balance remains.
4. The stay is closed.
5. The room and reservation identifiers become available for future test reservations where applicable.
6. Biometric access for the stay is revoked.
7. Receipt data is returned.

## Development Guidelines

- Keep service code, packages, classes, variables, and configuration in English.
- Keep user-facing text in frontend i18n files.
- Do not hardcode credentials.
- Do not commit `.env`.
- Prefer shared domain and service abstractions when adding repeated behavior.
- Keep adapters isolated from orchestration services.
- Keep Oracle schema changes documented in `database/oracle`.
- Run at least a Maven build after backend changes.
