# device-service

Microservico planejado para monitoramento dos totens e dispositivos fisicos.

## Status

Planejado como servico independente. No MVP atual, dados do kiosk sao usados pelo `checkin-service`.

## Responsabilidades

- Cadastrar totens.
- Receber heartbeat.
- Monitorar camera, leitor de documento, impressora e emissor de chave.
- Registrar eventos de falha.
- Disponibilizar status operacional para o painel administrativo.

## Endpoints Planejados

- `POST /api/v1/devices/{kioskId}/heartbeat`
- `GET /api/v1/devices`
- `GET /api/v1/devices/{kioskId}`
- `POST /api/v1/devices/{kioskId}/events`

## Tabelas

- `fc_kiosk_device`
- `fc_device_event`

## Valor de Produto

Esse servico conecta a solucao ao dominio real da Flexmedia: o totem e um equipamento monitorado, com disponibilidade e suporte operacional.
