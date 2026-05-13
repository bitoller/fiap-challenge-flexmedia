# identity-service

Microservico planejado para identidade, autenticacao e autorizacao.

## Status

Planejado. Ainda nao possui codigo Java neste repositorio.

## Responsabilidades

- Login de operadores administrativos.
- Cadastro de usuarios internos.
- Perfis e permissoes.
- Emissao e validacao de JWT.
- Credenciais tecnicas para totens.
- Auditoria de acessos.

## Papeis

- `ADMIN`
- `MANAGER`
- `RECEPTIONIST`
- `AUDITOR`
- `KIOSK`

## Endpoints Planejados

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/users/me`
- `GET /api/v1/users`
- `POST /api/v1/kiosk-credentials`

## Banco

Tabelas planejadas:

- `fc_user`
- `fc_role`
- `fc_user_role`
- `fc_kiosk_credential`

## MVP

No MVP atual, autenticacao ainda nao bloqueia o fluxo do totem. A evolucao deve proteger endpoints administrativos e operacoes sensiveis com JWT.
