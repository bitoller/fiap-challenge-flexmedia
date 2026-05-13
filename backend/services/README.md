# Services

Backend microservices for FlexCheck.

## Active Components

- [api-gateway](api-gateway/README.md)
- [checkin-service](checkin-service/README.md)
- [reservation-service](reservation-service/README.md)
- [payment-service](payment-service/README.md)
- [key-service](key-service/README.md)
- [admin-service](admin-service/README.md)
- [device-service](device-service/README.md)
- [identity-service](identity-service/README.md)
- [notification-service](notification-service/README.md)
- [biometry-service](biometry-service/README.md)
- [pms-adapter-service](pms-adapter-service/README.md)

## Run the full stack

From the project root:

```bash
Copy-Item .env.demo.example .env
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

## Run individual services

### checkin-service

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

### api-gateway

```bash
cd backend/services/api-gateway
mvn spring-boot:run
```

### admin-service

```bash
cd backend/services/admin-service
mvn spring-boot:run
```

### reservation-service

```bash
cd backend/services/reservation-service
mvn spring-boot:run
```

## Notes

- `checkin-service` orchestrates the guest kiosk flow.
- `reservation-service` now owns reservation create, delete, list, and guest confirmation for persistent test data.
- `admin-service` exposes hotel dashboard, branding, devices, audit, and admin login contracts.
- `identity-service` and `notification-service` still use in-memory storage in the MVP.
- `biometry-service` and `pms-adapter-service` remain future integration contracts.
