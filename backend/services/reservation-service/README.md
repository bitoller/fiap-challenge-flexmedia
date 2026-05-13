# reservation-service

Microservico planejado para reservas, hospedes, quartos e disponibilidade.

## Status

Planejado como servico independente. No MVP atual, suas responsabilidades foram implementadas dentro do `checkin-service`.

## Responsabilidades

- Buscar reserva por codigo, documento, e-mail ou QR Code.
- Consultar hospedes vinculados a uma reserva.
- Validar elegibilidade para check-in automatico.
- Consultar e atualizar status de quartos.
- Sincronizar reservas com o PMS.

## Endpoints Planejados

- `GET /api/v1/reservations/search`
- `GET /api/v1/reservations/{id}`
- `POST /api/v1/reservations/{id}/eligibility`
- `GET /api/v1/rooms/available`
- `PATCH /api/v1/rooms/{roomId}/status`

## Tabelas

Usadas hoje pelo `checkin-service` e futuramente de propriedade deste servico:

- `fc_hotel`
- `fc_room`
- `fc_guest`
- `fc_reservation`
- `fc_reservation_guest`

## Regras Criticas

- Reserva cancelada nao pode fazer check-in.
- Reserva ja usada nao pode gerar novo check-in.
- Quarto precisa estar disponivel.
- Busca por documento deve proteger dados pessoais.

## MVP Atual

Para testar hoje:

```text
GET /api/v1/reservations/search?type=RESERVATION_CODE&value=RSV-2026-0001
```

Esse endpoint esta no `checkin-service`.
