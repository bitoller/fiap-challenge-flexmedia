# api-gateway

Gateway Spring Boot do MVP. Ele oferece uma entrada unica para o frontend e encaminha `/api/v1/**` para os microservicos corretos.

## Status

Implementado.

## Responsabilidades

- Expor health check proprio.
- Encaminhar requisicoes de API para os microservicos corretos.
- Propagar cabecalhos relevantes.
- Criar `X-Correlation-Id` quando a chamada nao enviar um.
- Centralizar a URL consumida pelo frontend.

## Rotas

- `GET /gateway/health`: health do gateway.
- `/api/v1/**`: proxy para os microservicos corretos.
- `/api/v1/stays/**`: proxy para o `checkin-service` para lookup e checkout.

## Como Rodar

Suba primeiro o `checkin-service`:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Depois rode o gateway:

```bash
cd backend/services/api-gateway
mvn spring-boot:run
```

Padrao:

- Gateway: `http://127.0.0.1:8088`
- Checkin service esperado: `http://localhost:8080`

Se o `checkin-service` estiver em outra porta:

```bash
CHECKIN_SERVICE_URL=http://localhost:8081 mvn spring-boot:run
```

## Docker

Na demo Docker, o gateway usa a rede interna do compose:

```text
CHECKIN_SERVICE_URL=http://checkin-service:8080
```

Para subir tudo pela raiz:

```bash
docker compose up --build
```

## Frontend via Gateway

```bash
cd frontend/kiosk-web
VITE_API_URL=http://127.0.0.1:8088/api/v1 npm run dev
```

## Evolucao

- JWT e RBAC.
- Rate limit por totem.
- Circuit breaker.
- Logs estruturados.
- Roteamento para os demais microservicos quando forem implementados.
