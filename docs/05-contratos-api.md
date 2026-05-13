# Contratos de API

## 1. Padroes Gerais

Base path sugerido:

- `/api/v1`

Cabecalhos:

- `Authorization: Bearer <token>` para painel administrativo.
- `X-Kiosk-Token: <token>` para totem.
- `X-Correlation-Id: <uuid>` para rastreabilidade.
- `Idempotency-Key: <uuid>` em operacoes criticas.

Formato de erro:

```json
{
  "code": "RESERVATION_NOT_ELIGIBLE",
  "message": "A reserva ainda nao esta liberada para check-in.",
  "details": {
    "reason": "CHECKIN_WINDOW_NOT_OPEN"
  },
  "correlationId": "3b2a7e8c-4d9a-4e13-9c88-3d3f1d6f0c11"
}
```

## 2. Check-in Service

### Criar sessao

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

### Associar reserva a sessao

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

### Confirmar dados

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

### Registrar consentimentos

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

### Concluir check-in

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

### Concluir check-out

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

### Buscar reserva

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

### Validar elegibilidade

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

### Pre-autorizar pagamento

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

### Emitir chave

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
  "keyId": 7001,
  "status": "ACTIVE",
  "keyValue": "KEY-5001-1204",
  "expiresAt": "2026-05-13T12:00:00"
}
```

## 6. Device Service

### Heartbeat do totem

`POST /api/v1/devices/{kioskId}/heartbeat`

Request:

```json
{
  "status": "ONLINE",
  "components": {
    "camera": "OK",
    "printer": "OK",
    "keyEncoder": "OK"
  }
}
```

## 7. Eventos de Dominio

Eventos recomendados:

- `ReservationSynchronized`
- `CheckinSessionStarted`
- `GuestDataConfirmed`
- `ConsentRegistered`
- `DocumentVerificationCompleted`
- `BiometryVerificationCompleted`
- `PaymentAuthorized`
- `CheckinCompleted`
- `KeyIssued`
- `CheckoutCompleted`
- `PmsSyncFailed`
- `KioskDeviceFailed`

Exemplo:

```json
{
  "eventType": "CheckinCompleted",
  "eventVersion": 1,
  "occurredAt": "2026-05-11T18:10:00",
  "correlationId": "3b2a7e8c-4d9a-4e13-9c88-3d3f1d6f0c11",
  "payload": {
    "reservationId": 10,
    "stayId": 5001,
    "kioskId": 1
  }
}
```

