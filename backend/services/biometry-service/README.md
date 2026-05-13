# biometry-service

Microservico de validacao facial do FlexCheck.

## Status

Implementado.

## Responsabilidades

- Registrar verificacoes biometrica com ou sem consentimento.
- Permitir revisao manual do resultado.
- Persistir rastreabilidade sem guardar imagem bruta.
- Manter o fluxo de check-in desacoplado do dominio biometrico.

## Endpoints

- `POST /api/v1/biometry/verifications`
- `GET /api/v1/biometry/verifications/{id}`
- `POST /api/v1/biometry/verifications/{id}/review`

## Tabela

- `fc_biometry_verification`

## Observacao

O `checkin-service` consome este servico por HTTP e deixa de gravar biometria localmente.
