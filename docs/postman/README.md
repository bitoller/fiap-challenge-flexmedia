# Postman

Official collection for testing the FlexCheck hotel MVP.

## Files

- `FlexCheck-Hotel.postman_collection.json`: collection with health checks, reservation lookup, full check-in flow, checkout, and dashboard checks.

## How to Use

1. Import `FlexCheck-Hotel.postman_collection.json` into Postman.
2. Start `checkin-service`.
3. Adjust the `baseUrl` variable if the backend is running on a different port.
4. Run the `Check-in Flow` folder in order.
5. Run `Checkout` after `Complete Check-in` populates the `stayId` variable.

Main variables:

- `baseUrl`: direct API for `checkin-service`, default `http://127.0.0.1:8081/api/v1` in the Docker demo.
- `gatewayUrl`: optional gateway, default `http://127.0.0.1:8088`.
- `reservationCode`: demo reservation, default `RSV-2026-0001`.
- `sessionId`, `guestId`, `stayId`: populated automatically by the collection tests.

If you are running without Docker and port `8080` is already in use, start the backend with:

```bash
cd backend/services/checkin-service
SERVER_PORT=8081 mvn spring-boot:run
```

Then set `baseUrl` to:

```text
http://127.0.0.1:8081/api/v1
```
