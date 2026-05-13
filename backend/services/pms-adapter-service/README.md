# pms-adapter-service

Microservico de integracao com PMS hoteleiro.

## Status

Implementado.

## Responsabilidades

- Registrar eventos de check-in e check-out recebidos pelos demais servicos.
- Persistir o historico de sincronizacao com o PMS.
- Expor pendencias e reprocessamento de eventos.

## Endpoints

- `POST /api/v1/pms/events`
- `POST /api/v1/pms/checkins`
- `POST /api/v1/pms/checkouts`
- `GET /api/v1/pms/events/{eventId}`
- `GET /api/v1/pms/events/pending`
- `POST /api/v1/pms/events/{eventId}/retry`

## Tabela

- `fc_pms_event`

## Observacao

O `checkin-service` envia os eventos de sincronizacao para este servico por HTTP.
