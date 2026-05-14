# API Contracts

## 1. General Conventions

Base path:

- `/api/v1`

Headers:

- `Authorization: Bearer <token>` for administrative access
- `X-Kiosk-Token: <token>` for kiosk requests
- `X-Correlation-Id: <uuid>` for traceability
- `Idempotency-Key: <uuid>` for operations that must not be processed twice

Standard error payload:

```json
{
  "code": "RESERVATION_NOT_ELIGIBLE",
  "message": "The reservation is not yet eligible for check-in.",
  "details": {
    "reason": "CHECKIN_WINDOW_NOT_OPEN"
  },
  "correlationId": "3b2a7e8c-4d9a-4e13-9c88-3d3f1d6f0c11"
}
```

## 2. Check-in Service

### Create session

`POST /api/v1/checkin-sessions`

Request:

```json
{
  "kioskId": 1,
  "flowType": "CHECKIN",
  "language": "pt-BR"
}
```

Response:

```json
{
  "sessionId": 1001,
  "status": "STARTED",
  "expiresAt": "2026-05-11T18:30:00"
}
```

### Attach reservation to session

`POST /api/v1/checkin-sessions/{sessionId}/reservation`

Request:

```json
{
  "searchType": "RESERVATION_CODE",
  "searchValue": "RSV-2026-0001"
}
```

Response:

```json
{
  "sessionId": 1001,
  "status": "RESERVATION_FOUND",
  "reservation": {
    "id": 10,
    "code": "RSV-2026-0001",
    "guestName": "Lucas Henrique",
    "arrivalDate": "2026-05-11",
    "departureDate": "2026-05-13",
    "roomType": "STANDARD",
    "eligible": true
  }
}
```

### Confirm guest data

`POST /api/v1/checkin-sessions/{sessionId}/guest-confirmation`

Request:

```json
{
  "guestId": 20,
  "fullName": "Lucas Henrique Rodrigues",
  "documentType": "CPF",
  "documentNumber": "12345678909",
  "birthDate": "1995-08-15",
  "email": "lucas@example.com",
  "phone": "+5511999999999"
}
```

### Register consents

`POST /api/v1/checkin-sessions/{sessionId}/consents`

Request:

```json
{
  "items": [
    {
      "type": "PRIVACY_POLICY",
      "accepted": true,
      "version": "2026.05"
    },
    {
      "type": "BIOMETRY",
      "accepted": false,
      "version": "2026.05"
    }
  ]
}
```

### Complete check-in

`POST /api/v1/checkin-sessions/{sessionId}/complete-checkin`

Request:

```json
{
  "paymentMethod": "TEST_CARD_APPROVED",
  "keyType": "DIGITAL"
}
```

Response:

```json
{
  "sessionId": 1001,
  "status": "CHECKED_IN",
  "stayId": 5001,
  "roomNumber": "1204",
  "key": {
    "type": "DIGITAL",
    "value": "KEY-5001-1204",
    "expiresAt": "2026-05-13T12:00:00"
  }
}
```

### Complete check-out

`POST /api/v1/stays/{stayId}/checkout`

Request:

```json
{
  "paymentMethod": "TEST_CARD_APPROVED",
  "confirmCharges": true
}
```

Response:

```json
{
  "stayId": 5001,
  "status": "CHECKED_OUT",
  "totalPaid": 780.00,
  "receiptCode": "RCP-5001"
}
```

## 3. Reservation Service

### Search reservation

`GET /api/v1/reservations/search?type=RESERVATION_CODE&value=RSV-2026-0001`

Response:

```json
{
  "id": 10,
  "code": "RSV-2026-0001",
  "status": "CONFIRMED",
  "arrivalDate": "2026-05-11",
  "departureDate": "2026-05-13",
  "hotelId": 1,
  "primaryGuest": {
    "id": 20,
    "name": "Lucas Henrique Rodrigues"
  }
}
```

### Validate eligibility

`POST /api/v1/reservations/{reservationId}/eligibility`

Response:

```json
{
  "reservationId": 10,
  "eligible": true,
  "reasons": []
}
```

## 4. Payment Service

### Pre-authorize payment

`POST /api/v1/payments/pre-authorizations`

Request:

```json
{
  "stayId": 5001,
  "amount": 500.00,
  "method": "TEST_CARD_APPROVED"
}
```

Response:

```json
{
  "transactionId": 9001,
  "status": "APPROVED",
  "authorizationCode": "AUTH-9001"
}
```

## 5. Key Service

### Issue key

`POST /api/v1/keys`

Request:

```json
{
  "stayId": 5001,
  "roomId": 101,
  "type": "DIGITAL"
}
```

Response:

```json
{
  "keyId": 3001,
  "status": "ACTIVE",
  "value": "KEY-5001-1204"
}
```

### Revoke key

`DELETE /api/v1/keys/{keyId}`

Response:

```json
{
  "keyId": 3001,
  "status": "REVOKED"
}
```

## 6. Device Service

### Register heartbeat

`POST /api/v1/devices/{deviceId}/heartbeat`

Request:

```json
{
  "status": "ONLINE",
  "lastSeenAt": "2026-05-11T18:30:00"
}
```

Response:

```json
{
  "deviceId": 1,
  "status": "ONLINE"
}
```

## 7. Domain Events

Services emit domain events for operational visibility and auditability. The exact transport may vary, but the event shape should remain stable.

Suggested event example:

```json
{
  "eventType": "CHECKIN_COMPLETED",
  "occurredAt": "2026-05-11T18:30:00",
  "correlationId": "3b2a7e8c-4d9a-4e13-9c88-3d3f1d6f0c11",
  "hotelId": 1,
  "reservationCode": "RSV-2026-0001"
}
```
