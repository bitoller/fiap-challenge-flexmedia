# notification-service

Microservico planejado para comunicacoes, comprovantes e alertas operacionais.

## Status

Planejado. Ainda nao possui codigo Java neste repositorio.

## Responsabilidades

- Enviar comprovante de check-in e checkout.
- Enviar chave digital por canal configurado.
- Alertar recepcao sobre falhas e handoff.
- Registrar status de envio.
- Consumir eventos de dominio.

## Eventos Planejados

- `CheckinCompleted`
- `KeyIssued`
- `CheckoutCompleted`
- `KioskDeviceFailed`
- `SessionHandedOff`

## Endpoints Planejados

- `POST /api/v1/notifications/receipts`
- `POST /api/v1/notifications/alerts`
- `GET /api/v1/notifications/{id}`

## MVP Atual

O envio e apresentado na tela final do totem como comportamento simulado. A persistencia de notificacoes fica para evolucao.
