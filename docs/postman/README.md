# Postman

Collection oficial para testar o MVP do FlexCheck Hotel.

## Arquivos

- `FlexCheck-Hotel.postman_collection.json`: collection com health checks, busca de reserva, fluxo completo de check-in, checkout e dashboard.

## Como usar

1. Importe `FlexCheck-Hotel.postman_collection.json` no Postman.
2. Suba o `checkin-service`.
3. Ajuste a variavel `baseUrl` se o backend estiver em outra porta.
4. Rode a pasta `Check-in Flow` em ordem.
5. Rode `Checkout` depois que `Complete Check-in` preencher a variavel `stayId`.

Variaveis principais:

- `baseUrl`: API direta do `checkin-service`, padrao `http://127.0.0.1:8081/api/v1` na demo Docker.
- `gatewayUrl`: gateway opcional, padrao `http://127.0.0.1:8088`.
- `reservationCode`: reserva de demonstracao, padrao `RSV-2026-0001`.
- `sessionId`, `guestId`, `stayId`: preenchidas automaticamente pelos testes da collection.

Se estiver rodando sem Docker e a porta `8080` estiver ocupada, suba o backend com:

```bash
cd backend/services/checkin-service
SERVER_PORT=8081 mvn spring-boot:run
```

Depois altere `baseUrl` para:

```text
http://127.0.0.1:8081/api/v1
```
