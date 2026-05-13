# notification-service

Servico de comunicacoes do FlexCheck.

## O que ele faz

- registra comprovantes de check-in e check-out
- registra alertas operacionais
- lista notificacoes enviadas
- consulta uma notificacao especifica

## Status

Implementado para o MVP com armazenamento em memoria.

## Como subir

### Via Docker Compose

Na raiz do projeto:

```bash
docker compose up -d --build notification-service
```

Porta padrao:

- `http://localhost:8091`

### Via Spring Boot

```bash
cd backend/services/notification-service
mvn spring-boot:run
```

## Endpoints

- `POST /api/v1/notifications/receipts`
- `POST /api/v1/notifications/alerts`
- `GET /api/v1/notifications`
- `GET /api/v1/notifications/{id}`

## Exemplo rapido

```bash
curl -X POST http://localhost:8091/api/v1/notifications/alerts \
  -H "Content-Type: application/json" \
  -d "{\"channel\":\"IN_APP\",\"recipient\":\"reception\",\"subject\":\"Test\",\"message\":\"Hello\",\"relatedResourceType\":\"SESSION\",\"relatedResourceId\":\"1\"}"
```

## Observacoes

- O armazenamento e em memoria no MVP.
- O servico foi desenhado para evoluir depois para e-mail, SMS e WhatsApp.
- O contrato e usado pelo `checkin-service` para avisos e comprovantes.
