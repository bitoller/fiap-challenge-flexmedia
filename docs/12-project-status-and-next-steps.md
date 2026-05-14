# Project Status and Next Steps

## 1. What Has Been Built

### Backend

Implemented:

- `checkin-service`
- `api-gateway`

The `checkin-service` is organized with Clean Architecture:

- `controller`
- `dto`
- `mapper`
- `service`
- `repository`
- `domain`
- `infrastructure`
- `config`

Documented and structured:

- `reservation-service`
- `payment-service`
- `key-service`
- `biometry-service`
- `device-service`
- `notification-service`
- `pms-adapter-service`
- `identity-service`

In the MVP, `checkin-service` concentrates the main flow to reduce risk. Internally, it already covers reservation handling, simulated check-in, simulated payment, simulated key issuance, check-out, and auditing.

### Frontend

Implemented:

- `kiosk-web`

Still pending:

- `admin-web`

### Database

Created:

- Oracle schema in `database/oracle/schema.sql`
- Dynamic seed in `database/oracle/seed.sql`
- Reset script in `database/oracle/reset.sql`
- Full FIAP setup in `database/oracle/setup_fiap.sql`
- Verification script in `database/oracle/verify.sql`
- JPA entities in the backend so tables can be created automatically through Hibernate

## 2. Gateway Overview

The `api-gateway` is implemented as a Spring Boot MVP gateway.

It runs by default at:

```text
http://localhost:8088
```

Endpoints:

```text
GET /gateway/health
```

It forwards:

```text
/api/v1/** -> checkin-service
```

By default, it points to:

```text
http://localhost:8080
```

To change it:

```bash
CHECKIN_SERVICE_URL=http://localhost:8081 mvn spring-boot:run
```

The gateway was validated locally by forwarding a reservation lookup to `checkin-service`.

## 3. Oracle FIAP Setup

In the IDE, open the connection:

```text
oracle.fiap.com.br:1521:ORCL
```

Recommended current option: let the backend create the tables through JPA entities.

Configure:

```env
JPA_DDL_AUTO=update
```

Run `checkin-service` once. Hibernate will create or update the `FC_*` tables.

Then, to load demo data, run:

```text
database/oracle/seed.sql
```

Alternative option: if you want to reset everything by script, run:

```text
database/oracle/setup_fiap.sql
```

This script:

1. Removes existing `FC_*` tables.
2. Creates the tables.
3. Inserts test data.
4. Prints table and reservation counts.

Then configure the backend:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
ORACLE_PASSWORD=your-password
```

And run:

```bash
cd backend/services/checkin-service
set -a
source .env
set +a
mvn spring-boot:run
```

## 4. What Still Needs to Be Completed for a Strong MVP

High priority:

- Run the backend with `JPA_DDL_AUTO=update` on Oracle FIAP to create the tables.
- Run `seed.sql` on Oracle FIAP to load the test reservations.
- Test `checkin-service` against the real Oracle database.
- Point the frontend to the gateway for the demo.
- Create a simple `admin-web`.
- Create a demo script with one success reservation and one error reservation.
- Add error tests for rejected document, ineligible reservation, and declined payment.

Medium priority:

- Add automated tests for business rules.
- Create administrative endpoints to list reservations, sessions, and stays.
- Improve session expiration handling.
- Add logs with `correlationId` to all flows.
- Create real Dockerfiles for `checkin-service`, `api-gateway`, and `kiosk-web`.

Low priority, for the final board presentation:

- Separate the real `reservation-service`.
- Separate the simulated `payment-service`.
- Separate the simulated `key-service`.
- Implement a more complete `admin-web`.
- Add a kiosk monitoring screen.
- Add an operational report.

## 5. What Is Still Missing

- Real authentication for administrative users.
- `identity-service` implementation.
- Real PMS integration.
- Real payment integration.
- Real biometric integration.
- Real physical key integration.
- Real e-mail or WhatsApp delivery.
- Final Docker Compose deployment with all services.

## 6. Recommended Path Forward

The most practical next steps are:

1. Create the Oracle database.
2. Run `checkin-service` against that database.
3. Run `api-gateway`.
4. Run `kiosk-web` against the gateway.
5. Create `admin-web`.

With that sequence, the project will already have a complete and coherent demo aligned with the architecture.
