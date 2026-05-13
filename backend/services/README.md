# Services

Microservicos do backend FlexCheck.

## Componentes ativos

- [api-gateway](api-gateway/README.md)
- [checkin-service](checkin-service/README.md)
- [reservation-service](reservation-service/README.md)
- [payment-service](payment-service/README.md)
- [key-service](key-service/README.md)
- [admin-service](admin-service/README.md)
- [device-service](device-service/README.md)
- [identity-service](identity-service/README.md)
- [notification-service](notification-service/README.md)
- [biometry-service](biometry-service/README.md)
- [pms-adapter-service](pms-adapter-service/README.md)

## Como subir a stack completa

Na raiz do projeto:

```bash
Copy-Item .env.demo.example .env
docker compose up -d --build
```

Isso sobe:

- `checkin-service`
- `api-gateway`
- `reservation-service`
- `payment-service`
- `key-service`
- `admin-service`
- `device-service`
- `identity-service`
- `notification-service`
- `biometry-service`
- `pms-adapter-service`
- `kiosk-web`

## Como subir um servico isolado

Cada servico pode ser executado sozinho para desenvolvimento local.

### checkin-service

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

### api-gateway

```bash
cd backend/services/api-gateway
mvn spring-boot:run
```

### identity-service

```bash
cd backend/services/identity-service
mvn spring-boot:run
```

### notification-service

```bash
cd backend/services/notification-service
mvn spring-boot:run
```

## Observacoes importantes

- `checkin-service` orquestra o fluxo principal do totem.
- `reservation-service`, `payment-service`, `key-service`, `admin-service` e `device-service` podem ser consumidos pelo gateway ou direto via HTTP.
- `identity-service` e `notification-service` usam armazenamento em memoria no MVP.
- `biometry-service` e `pms-adapter-service` continuam como contratos de integracao para evolucao futura.
