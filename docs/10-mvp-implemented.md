# Implemented MVP

## 1. Current Status

The first functional MVP slice includes:

- Java Spring Boot backend under `backend/services`.
- Spring Boot API Gateway under `backend/services/api-gateway`.
- React kiosk frontend under `frontend/kiosk-web`.
- React admin frontend under `frontend/admin-web`.
- Persistence through Oracle FIAP.
- Table creation through JPA/Hibernate entities and SQL scripts when needed.
- Check-in and checkout flows validated through API and kiosk screens.
- Backend services organized with Clean Architecture and SOLID principles.
- Automated flow tests for use cases.

## 2. What Works

### Backend

- MVP gateway forwarding `/api/v1/**` to the correct service.
- Use cases separated in the `service` layer.
- Domain logic decoupled from Spring/JDBC.
- JDBC adapters implementing repository interfaces.
- JPA entities in infrastructure for schema creation.
- Session creation.
- Reservation lookup by code, CPF, and QR token.
- Reservation eligibility validation.
- Guest data confirmation.
- LGPD consent recording.
- Simulated document validation.
- Optional biometric verification.
- Simulated approved or declined payment.
- Stay creation.
- Simulated digital key issuance.
- Checkout.
- Key revocation.
- Reservation and room updates.
- Audit recording.
- Basic administrative dashboard.

### Kiosk Frontend

- Home screen with check-in, checkout, and services entry points.
- Reservation lookup by CPF, reservation code, or QR token.
- Reservation summary.
- Contact data confirmation.
- Terms and optional biometric consent.
- Simulated payment.
- Success screen with room, digital key, and stay details.
- Checkout by active stay lookup.
- Error states with retry and reception fallback actions.

## 3. Quick Start

Backend with Oracle FIAP:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

If port `8080` is already in use:

```bash
SERVER_PORT=8081 mvn spring-boot:run
```

Frontend:

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

With the backend on another port:

```bash
VITE_API_URL=http://127.0.0.1:8081/api/v1 npm run dev
```

Open:

```text
http://localhost:5173
```

## 4. Test Data

Reservations:

- `RSV-2026-0001`
- `RSV-2026-0002`

Simulated payments:

- `TEST_CARD_APPROVED`
- `TEST_CARD_DECLINED`

## 5. Technical Decision

The backend started with a modular MVP inside `checkin-service` and has since been split into dedicated services for reservation, payment, key, identity, biometrics, notification, device, PMS, and admin concerns.

Compatibility paths remain documented where they are still useful for local testing or safe fallback behavior.

## 6. Next Steps

- Continue refining the admin portal.
- Validate the Oracle FIAP schema after each structural change.
- Expand automated tests for reservation eligibility and error cases.
- Improve accessibility and responsiveness in kiosk-specific layouts.
