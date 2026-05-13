# device-service

Servico responsavel pelo estado dos totens e equipamentos do hotel.

## Status

Implementado com armazenamento em memoria para o MVP.

## Responsabilidades

- Registrar heartbeat de totems.
- Listar dispositivos cadastrados.
- Expor status consolidado para o painel administrativo.
- Ajudar a identificar totens online, offline, em manutencao ou em erro.

## Endpoints

- `POST /api/v1/devices/heartbeats`
- `GET /api/v1/devices`
- `GET /api/v1/devices/{deviceCode}`
- `GET /api/v1/devices/status`

