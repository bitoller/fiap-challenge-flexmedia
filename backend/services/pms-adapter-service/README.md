# pms-adapter-service

Microservico planejado para isolar a integracao com PMS hoteleiro.

## Status

Planejado. No MVP, o PMS opera em modo `MOCK` com dados no Oracle.

## Responsabilidades

- Traduzir contratos externos de PMS para o dominio FlexCheck.
- Buscar reservas e hospedes.
- Sincronizar check-in e checkout.
- Registrar eventos pendentes e tentativas.
- Reprocessar falhas.

## Endpoints Planejados

- `GET /api/v1/pms/reservations/{code}`
- `POST /api/v1/pms/checkins`
- `POST /api/v1/pms/checkouts`
- `GET /api/v1/pms/events/pending`
- `POST /api/v1/pms/events/{eventId}/retry`

## Tabela

- `fc_pms_event`

## MVP Atual

Os dados de PMS sao representados por `seed.sql` e pelas tabelas Oracle do projeto. A integracao externa real fica encapsulada aqui na evolucao.
