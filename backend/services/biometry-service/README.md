# biometry-service

Microservico planejado para validacao facial opcional.

## Status

Planejado como servico independente. No MVP atual, o resultado biometrico simulado e registrado pelo `checkin-service`.

## Responsabilidades

- Verificar consentimento antes da validacao.
- Simular aprovacao ou pular biometria.
- Registrar resultado sem armazenar imagem bruta.
- Suportar fallback para atendimento humano.
- Preservar rastreabilidade LGPD.

## Endpoints Planejados

- `POST /api/v1/biometry/verifications`
- `GET /api/v1/biometry/verifications/{id}`
- `POST /api/v1/biometry/verifications/{id}/review`

## Tabela

- `fc_biometry_verification`

## LGPD

Biometria e dado pessoal sensivel. O fluxo deve exigir consentimento explicito, permitir recusa sem bloquear a hospedagem e evitar armazenamento de imagem bruta.

## MVP Atual

No endpoint `complete-checkin`, use:

```json
{
  "biometryStatus": "APPROVED"
}
```

ou:

```json
{
  "biometryStatus": "SKIPPED"
}
```
