# Services

Microservicos do backend FlexCheck Hotel.

## Implementados

- [api-gateway](api-gateway/README.md)
- [checkin-service](checkin-service/README.md)

## Planejados

- [identity-service](identity-service/README.md)
- [reservation-service](reservation-service/README.md)
- [payment-service](payment-service/README.md)
- [key-service](key-service/README.md)
- [biometry-service](biometry-service/README.md)
- [notification-service](notification-service/README.md)
- [device-service](device-service/README.md)
- [pms-adapter-service](pms-adapter-service/README.md)

## Execucao Recomendada

API principal:

```bash
cd checkin-service
mvn spring-boot:run
```

Gateway:

```bash
cd api-gateway
mvn spring-boot:run
```

## Demo com Docker

Na raiz do projeto:

```bash
cp .env.demo.example .env
docker compose up --build
```

Isso sobe:

- `checkin-service`
- `api-gateway`
- `kiosk-web`

## Contrato de API

Use a collection:

```text
../../docs/postman/FlexCheck-Hotel.postman_collection.json
```
