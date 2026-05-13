# identity-service

Servico de identidade do FlexCheck.

## O que ele faz

- autentica usuarios da operacao
- emite e renova sessoes de acesso
- lista usuarios internos
- registra credenciais tecnicas de totens

## Status

Implementado para o MVP com armazenamento em memoria.

## Como subir

### Via Docker Compose

Na raiz do projeto:

```bash
docker compose up -d --build identity-service
```

Porta padrao:

- `http://localhost:8090`

### Via Spring Boot

```bash
cd backend/services/identity-service
mvn spring-boot:run
```

## Endpoints

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/users/me`
- `GET /api/v1/users`
- `POST /api/v1/kiosk-credentials`
- `GET /api/v1/kiosk-credentials`

## Exemplo rapido

```bash
curl -X POST http://localhost:8090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"owner@flexcheck.local\",\"password\":\"Welcome123!\"}"
```

## Observacoes

- O armazenamento e em memoria no MVP.
- O contrato ja esta separado para evoluir para JWT real no futuro.
- O servico e independente do Oracle nesta fase.
