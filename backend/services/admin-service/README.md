# admin-service

Servico administrativo do FlexCheck.

## Status

Implementado para dashboard, auditoria, status dos dispositivos e configuracao de hotel.

## Responsabilidades

- Expor dashboard operacional.
- Registrar auditoria de eventos.
- Consolidar status dos totens via `device-service`.
- Gerenciar perfil do hotel, branding e conteudos do totem.

## Endpoints

- `GET /api/v1/admin/dashboard`
- `POST /api/v1/admin/audit-events`
- `GET /api/v1/admin/hotels`
- `GET /api/v1/admin/hotels/{hotelId}`
- `PUT /api/v1/admin/hotels/{hotelId}/branding`
- `PUT /api/v1/admin/hotels/{hotelId}/content`

