# FlexCheck Hotel

FlexCheck is organized into two products:

- a guest kiosk for check-in and check-out
- a separate admin portal for hotel operations

The backend is split into microservices with clean architecture, clean code, and clear domain boundaries.

## What is ready

- `checkin-service`: orchestrates the kiosk flow
- `api-gateway`: entrypoint for `/api/v1/**`
- `reservation-service`: reservation lookup, list, create, delete, and guest confirmation
- `payment-service`: payment transactions
- `key-service`: key issuance and revocation
- `admin-service`: dashboard, devices, audit, branding, hotel profile, and admin login
- `device-service`: kiosk heartbeat and status
- `identity-service`: authentication, users, and technical credentials
- `notification-service`: receipts and alerts
- `biometry-service`: future biometric integration contract
- `pms-adapter-service`: future PMS integration contract
- `kiosk-web`: guest kiosk frontend
- `admin-web`: admin portal frontend

## Docker

### 1. Configure the environment

From the project root:

```bash
Copy-Item .env.demo.example .env
```

The demo env already uses:

- `ORACLE_USER=rm553134`
- `ORACLE_PASSWORD=060892`

If you use the FIAP Oracle instance, make sure the schema exists before starting the stack.

### 2. Start everything

```bash
docker compose up -d --build
```

This starts:

- `checkin-service`
- `api-gateway`
- `reservation-service`
- `payment-service`
- `key-service`
- `admin-service`
- `device-service`
- `identity-service`
- `notification-service`
- `biometry-service`
- `pms-adapter-service`
- `kiosk-web`
- `admin-web`

### 3. Stop everything

```bash
docker compose down
```

## Start only parts

### Kiosk and API

```bash
docker compose up -d --build checkin-service api-gateway kiosk-web
```

### Admin portal

```bash
docker compose up -d --build admin-service reservation-service admin-web
```

### Support services

```bash
docker compose up -d --build payment-service key-service device-service identity-service notification-service
```

### Future integration contracts

```bash
docker compose up -d --build biometry-service pms-adapter-service
```

## Run locally without Docker

### Kiosk frontend

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

### Admin frontend

```bash
cd frontend/admin-web
npm install
npm run dev
```

### Backend services

```bash
cd backend/services/checkin-service
mvn spring-boot:run

cd backend/services/api-gateway
mvn spring-boot:run
```

## Service docs

- [Backend services](backend/services/README.md)
- [admin-web](frontend/admin-web/README.md)
- [kiosk-web](frontend/kiosk-web/README.md)

## Oracle

The project uses schema `rm553134` in the FIAP Oracle environment and the versioned bootstrap scripts in `database/oracle/`.

To recreate the physical schema, run:

- `database/oracle/init/01_create_user.sql`
- `database/oracle/init/02_run_schema.sql`
- `database/oracle/init/03_run_seed.sql`

## Main flows

1. guest uses the kiosk for check-in
2. guest uses the kiosk for check-out
3. staff uses the admin portal to manage hotels and test reservations

## Architecture notes

- `checkin-service` remains the kiosk orchestrator.
- `reservation-service` now owns hotel-scoped reservation CRUD for kiosk tests.
- `admin-service` owns dashboard, branding, hotel profile, devices, audit, and login contracts.
- `identity-service` and `notification-service` still use in-memory storage in the MVP.
- `biometry-service` and `pms-adapter-service` remain future integration contracts.
