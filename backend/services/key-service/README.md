# key-service

Microservico planejado para emissao, consulta e revogacao de chaves.

## Status

Planejado como servico independente. No MVP atual, emissao e revogacao estao dentro do `checkin-service`.

## Responsabilidades

- Emitir chave digital.
- Registrar chave fisica simulada.
- Revogar chave no checkout.
- Controlar validade da chave.
- Integrar com fechaduras, QR Code, RFID ou chave mobile.

## Endpoints Planejados

- `POST /api/v1/keys`
- `GET /api/v1/keys/{keyId}`
- `GET /api/v1/stays/{stayId}/keys`
- `POST /api/v1/keys/{keyId}/revoke`

## Tabela

- `fc_key_credential`

## MVP Atual

O `checkin-service` gera chaves no formato:

```text
KEY-{stayId}-{roomId}
```

Exemplo:

```text
KEY-5001-1204
```
